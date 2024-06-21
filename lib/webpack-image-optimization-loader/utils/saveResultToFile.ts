import fs from "fs";
import { ImageInfo } from "../../types/common";

export const saveResultToFile = (
  imageInfo: ImageInfo,
  resultFilePath: string,
) => {
  fs.writeFileSync(resultFilePath, JSON.stringify(imageInfo));
};
