const sizeOf = require('image-size');
const sharp = require('sharp');

const fs = require('fs');
const path = require('path');

const SCREEN_BREAK_POINT = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

const resultFolderPath = path.join(process.cwd(), 'public', 'optimized');
const resultFilePath = path.join(process.cwd(), 'result.json');

const createResizedFolderIfNotExists = () => {
    if (!fs.existsSync(resultFolderPath)) {
        fs.mkdirSync(resultFolderPath);
    }
};

const updateImageInfo = (imageInfo, fileName, breakpoint, fileSrc) => {
    imageInfo[fileName] = {
        ...imageInfo[fileName],
        [breakpoint]: fileSrc,
    };
};

const optimizeOriginalImage = async (file, imageInfo, fileName, filePath) => {
    updateImageInfo(imageInfo, fileName, 'original', filePath);

    updateImageInfo(
        imageInfo,
        fileName,
        'optimized',
        path.join('/optimized', `${fileName}.webp`),
    );

    await sharp(file)
        .webp()
        .toFile(path.join(resultFolderPath, `${fileName}.webp`), (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
        });
};

const saveResultToFile = (imageInfo) => {
    fs.writeFileSync(resultFilePath, JSON.stringify(imageInfo));
};

const processImage = async (file, fileName, imageInfo, filePath) => {
    const fileSize = sizeOf(file);

    createResizedFolderIfNotExists();

    try {
        await Promise.all(
            Object.entries(SCREEN_BREAK_POINT).map(
                async ([breakpoint, breakpointWidth]) => {
                    const isResizingNeeded = breakpointWidth < fileSize.width;

                    const fileSrc = isResizingNeeded
                        ? `${fileName}.${breakpoint}.webp`
                        : `${fileName}.webp`;

                    updateImageInfo(
                        imageInfo,
                        fileName,
                        breakpoint,
                        path.join('/optimized', fileSrc),
                    );

                    return new Promise((resolve) => {
                        if (isResizingNeeded) {
                            sharp(file)
                                .resize(breakpointWidth)
                                .webp()
                                .toFile(
                                    path.join(
                                        resultFolderPath,
                                        `${fileName}.${breakpoint}.webp`,
                                    ),
                                    (err) => {
                                        if (err) {
                                            console.log(err);
                                            throw err;
                                        } else {
                                            resolve();
                                        }
                                    },
                                );
                        }

                        resolve();
                    });
                },
            ),
        );

        await optimizeOriginalImage(file, imageInfo, fileName, filePath);
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = async function () {
    const options = this.getOptions();

    const callback = this.async();

    const filePath = path.join(
        '/',
        path.relative(`${process.cwd()}/public`, this.resourcePath),
    );

    const file = fs.readFileSync(this.resourcePath);
    const fileName = path.basename(filePath, path.extname(filePath));

    try {
        let imageInfo = {};

        if (fs.existsSync(resultFilePath)) {
            const resultJsonFile = fs.readFileSync(resultFilePath);
            imageInfo = JSON.parse(resultJsonFile);
        } else {
            fs.writeFileSync(resultFilePath, JSON.stringify({}));
        }

        if (imageInfo[fileName]) {
            const isDuplicatedName = imageInfo[fileName].original !== filePath;

            if (isDuplicatedName){
                console.error(
                    `Error: Image with name ${fileName} already exists in result.json  \n`,
                    `duplicated path: ${filePath} and ${imageInfo[fileName].original}`,
                );
                process.exit(1);
            } else {
                callback(null, file);
            }
        } else {
            if (options.validationOnly) return callback(null, file);

            await processImage(file, fileName, imageInfo, filePath);
            saveResultToFile(imageInfo);
            callback(null, file);
        }

    } catch (e) {
        callback(e);
    }
};
