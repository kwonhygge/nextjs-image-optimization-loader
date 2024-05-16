import path from "path";
import sharp from "sharp";
import { updateImageInfo } from "./updateImageInfo";
import { ImageInfo } from "../types/common";

export const optimizeOriginalImage = async (
  file: Buffer,
  imageInfo: ImageInfo,
  fileName: string,
  filePath: string,
  optimizedFolderPath: string,
) => {
  updateImageInfo(imageInfo, fileName, "original", filePath);

  updateImageInfo(
    imageInfo,
    fileName,
    "optimized",
    path.join("/optimized", `${fileName}.webp`),
  );

  await sharp(file)
    .webp()
    .toFile(path.join(optimizedFolderPath, `${fileName}.webp`), (err) => {
      if (err) {
        console.log(err);
        throw err;
      }
    });
};
