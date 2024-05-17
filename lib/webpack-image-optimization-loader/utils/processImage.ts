import { createResizedFolderIfNotExists } from "./createSizeFolderIfNotExisits";
import { updateImageInfo } from "./updateImageInfo";
import { ImageInfo, ProcessImageOptions } from "../../types/common";
import { optimizeOriginalImage } from "./optimizeOriginalImage";
import path from "path";
import sizeOf from "image-size";
import sharp from "sharp";
import { getFileName } from "../../utils/file";

export const processImage = async (
  file: Buffer,
  imageInfo: ImageInfo,
  currentFilePath: string,
  options: ProcessImageOptions,
) => {
  const fileSize = sizeOf(file);
  const currentFileName = getFileName(currentFilePath);

  createResizedFolderIfNotExists(options.optimizedFolderPath);

  try {
    await Promise.all(
      Object.entries(options.screenBreakPoint).map(
        async ([breakpoint, breakpointWidth]) => {
          const isResizingNeeded = breakpointWidth < fileSize.width;

          const fileSrc = isResizingNeeded
            ? `${currentFileName}.${breakpoint}.webp`
            : `${currentFileName}.webp`;

          updateImageInfo(
            imageInfo,
            currentFileName,
            breakpoint,
            path.join("/optimized", fileSrc),
          );

          return new Promise<void>((resolve) => {
            if (isResizingNeeded && !options.validationOnly) {
              sharp(file)
                .resize(breakpointWidth)
                .webp()
                .toFile(
                  path.join(
                    options.optimizedFolderPath,
                    `${currentFileName}.${breakpoint}.webp`,
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

    await optimizeOriginalImage(file, imageInfo, currentFilePath, options);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
