import fs from "fs";
import path from "path";
import { processImage } from "./utils/processImage";
import { saveResultToFile } from "./utils/saveResultToFile";
import { ImageInfo, ProcessImageOptions } from "./types/common";

type Options = {
  validationOnly?: boolean;
  optimizedFolderName?: string;
  resultFileName?: string;
  screenBreakPoint?: {
    [key: string]: number;
  };
};

const DEFAULT_SCREEN_BREAK_POINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const DEFAULT_RESULT_FILE_NAME = "result.json";
const DEFAULT_OPTIMIZED_FOLDER_NAME = "optimized";

module.exports = async function () {
  const options: Options = this.getOptions();

  const resultFilePath = path.join(
    process.cwd(),
    options.resultFileName || DEFAULT_RESULT_FILE_NAME,
  );
  const optimizedFolderPath = path.join(
    process.cwd(),
    options.optimizedFolderName || DEFAULT_OPTIMIZED_FOLDER_NAME,
  );

  const processImageOptions: ProcessImageOptions = {
    validationOnly: !!options.validationOnly,
    screenBreakPoint: options.screenBreakPoint || DEFAULT_SCREEN_BREAK_POINT,
    resultFilePath,
    optimizedFolderPath,
  };

  const callback = this.async();

  const filePath = path.join(
    "/",
    path.relative(`${process.cwd()}/public`, this.resourcePath),
  );

  const fileBuffer = fs.readFileSync(this.resourcePath);
  const fileName = path.basename(filePath, path.extname(filePath));

  try {
    let imageInfo: ImageInfo = {};

    if (fs.existsSync(resultFilePath)) {
      const resultJsonFile = fs.readFileSync(resultFilePath);
      imageInfo = JSON.parse(resultJsonFile.toString());
    } else {
      fs.writeFileSync(resultFilePath, JSON.stringify({}));
    }

    if (imageInfo[fileName]) {
      const isDuplicatedName = imageInfo[fileName].original !== filePath;

      if (isDuplicatedName) {
        console.error(
          `Error: Image with name ${fileName} already exists in result.json  \n`,
          `duplicated path: ${filePath} and ${imageInfo[fileName].original}`,
        );
        process.exit(1);
      } else {
        callback(null, fileBuffer);
      }
    } else {
      if (options.validationOnly) return callback(null, fileBuffer);

      await processImage(
        fileBuffer,
        fileName,
        imageInfo,
        filePath,
        processImageOptions,
      );
      saveResultToFile(imageInfo, resultFilePath);
      callback(null, fileBuffer);
    }
  } catch (e) {
    callback(e);
  }
};
