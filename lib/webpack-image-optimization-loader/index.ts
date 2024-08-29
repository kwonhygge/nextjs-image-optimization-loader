import fs from "fs/promises";
import path from "path";
import { ImageInfo, Options, ProcessImageOptions } from "../types/common";
import { processImage } from "./utils/processImage";
import { saveResultToFile } from "./utils/saveResultToFile";
import { getFileName } from "../utils/file";
import lockfile from "proper-lockfile";

const DEFAULT_SCREEN_BREAK_POINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const DEFAULT_RESULT_FILE_NAME = "result.json";
export const DEFAULT_OPTIMIZED_FOLDER_NAME = "optimized";

const resultFilePath = path.join(process.cwd(), DEFAULT_RESULT_FILE_NAME);

const optimizedFolderPath = path.join(
  process.cwd(),
  "public",
  DEFAULT_OPTIMIZED_FOLDER_NAME,
);

export default async function () {
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

  const fileBuffer = await fs.readFile(this.resourcePath);
  const currentFileName = getFileName(currentFilePath);

  try {
    try {
      await fs.access(resultFilePath);
    } catch (error) {
      if (error.code === "ENOENT") {
        await fs.writeFile(resultFilePath, JSON.stringify({}));
      } else {
        throw error;
      }
    }

    const release = await lockfile.lock(resultFilePath, {
      retries: 5,
    });

    try {
      let imageInfo: ImageInfo = {};

      if (
        await fs
          .access(resultFilePath)
          .then(() => true)
          .catch(() => false)
      ) {
        const resultJsonFile = await fs.readFile(resultFilePath, "utf-8");
        imageInfo = JSON.parse(resultJsonFile);
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

        await saveResultToFile(imageInfo, resultFilePath);

        callback(null, fileBuffer);
      }
    } finally {
      await release();
    }
  } catch (e) {
    callback(e);
  }
}
