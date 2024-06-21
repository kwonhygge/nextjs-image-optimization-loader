import fs from "fs";
import path from "path";
import { ImageInfo, Options, ProcessImageOptions } from "../types/common";
import { processImage } from "./utils/processImage";
import { saveResultToFile } from "./utils/saveResultToFile";
import { getFileName } from "../utils/file";

const DEFAULT_SCREEN_BREAK_POINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const BUILD_TIME_LABEL = "이미지 로더 빌드 시간";
export const DEFAULT_RESULT_FILE_NAME = "result.json";
export const DEFAULT_OPTIMIZED_FOLDER_NAME = "optimized";

const resultFilePath = path.join(process.cwd(), DEFAULT_RESULT_FILE_NAME);

const optimizedFolderPath = path.join(
  process.cwd(),
  DEFAULT_OPTIMIZED_FOLDER_NAME,
);

module.exports = async function () {
  console.log("-----------------이미지 로더 빌드 시작-------------------");
  console.time(BUILD_TIME_LABEL);
  const options: Options = this.getOptions();

  const processImageOptions: ProcessImageOptions = {
    validationOnly: !!options.validationOnly,
    screenBreakPoint: options.screenBreakPoint || DEFAULT_SCREEN_BREAK_POINT,
    resultFilePath,
    optimizedFolderPath,
  };

  const callback = this.async();

  const currentFilePath = path.join(
    "/",
    path.relative(`${process.cwd()}/public`, this.resourcePath),
  );

  const fileBuffer = fs.readFileSync(this.resourcePath);
  const currentFileName = getFileName(currentFilePath);

  try {
    let imageInfo: ImageInfo = {};

    if (fs.existsSync(resultFilePath)) {
      const resultJsonFile = fs.readFileSync(resultFilePath);
      imageInfo = JSON.parse(resultJsonFile.toString());
    } else {
      fs.writeFileSync(resultFilePath, JSON.stringify({}));
    }

    if (imageInfo[currentFileName]) {
      const isDuplicatedName =
        imageInfo[currentFileName].original !== currentFilePath;

      if (isDuplicatedName) {
        console.error(
          `Error: Image with name ${currentFileName} already exists in ${DEFAULT_RESULT_FILE_NAME}  \n`,
          `duplicated path: ${currentFilePath} and ${imageInfo[currentFileName].original}`,
        );
        process.exit(1);
      } else {
        callback(null, fileBuffer);
      }
    } else {
      await processImage(
        fileBuffer,
        imageInfo,
        currentFilePath,
        processImageOptions,
      );

      saveResultToFile(imageInfo, resultFilePath);
      console.timeEnd(BUILD_TIME_LABEL);

      callback(null, fileBuffer);
    }
  } catch (e) {
    callback(e);
  }
};
