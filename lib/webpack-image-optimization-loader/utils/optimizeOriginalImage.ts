import path from "path";
import sharp from "sharp";
import { updateImageInfo } from "./updateImageInfo";
import { ImageInfo, ProcessImageOptions } from "../../types/common";
import { getFileName } from "../../utils/file";

export const optimizeOriginalImage = async (
  file: Buffer,
  imageInfo: ImageInfo,
  filePath: string,
  options: ProcessImageOptions,
) => {
  const fileName = getFileName(filePath);
  updateImageInfo(imageInfo, fileName, "original", filePath);

  updateImageInfo(
    imageInfo,
    fileName,
    "optimized",
    path.join("/optimized", `${fileName}.webp`),
  );

  if (!options.validationOnly) {
    sharp(file)
      .webp()
      .toFile(
        path.join(options.optimizedFolderPath, `${fileName}.webp`),
        (err) => {
          if (err) {
            console.log(err);
            throw err;
          }
        },
      );

    console.log(`Optimized original image for ${fileName}`);
  }
};
