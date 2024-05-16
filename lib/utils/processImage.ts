import { createResizedFolderIfNotExists } from "./createSizeFolderIfNotExisits";
import { updateImageInfo } from "./updateImageInfo";
import { ImageInfo, ProcessImageOptions } from "../types/common";
import { optimizeOriginalImage } from "./optimizeOriginalImage";
import path from "path";
import sizeOf from "image-size";
import sharp from "sharp";

export const processImage = async (
  file: Buffer,
  fileName: string,
  imageInfo: ImageInfo,
  filePath: string,
  options: ProcessImageOptions,
) => {
  const fileSize = sizeOf(file);

  createResizedFolderIfNotExists(options.optimizedFolderPath);

  try {
    await Promise.all(
      Object.entries(options.screenBreakPoint).map(
        async ([breakpoint, breakpointWidth]) => {
          const isResizingNeeded = breakpointWidth < fileSize.width;

          const fileSrc = isResizingNeeded
            ? `${fileName}.${breakpoint}.webp`
            : `${fileName}.webp`;

          updateImageInfo(
            imageInfo,
            fileName,
            breakpoint,
            path.join("/optimized", fileSrc),
          );

          return new Promise<void>((resolve) => {
            if (isResizingNeeded) {
              sharp(file)
                .resize(breakpointWidth)
                .webp()
                .toFile(
                  path.join(
                    options.optimizedFolderPath,
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

    await optimizeOriginalImage(
      file,
      imageInfo,
      fileName,
      filePath,
      options.optimizedFolderPath,
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
};
