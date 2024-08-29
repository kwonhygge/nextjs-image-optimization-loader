import fs from "fs/promises";
import { ImageInfo } from "../../types/common";

export const saveResultToFile = async (
  imageInfo: ImageInfo,
  resultFilePath: string,
): Promise<void> => {
  await fs.writeFile(resultFilePath, JSON.stringify(imageInfo, null, 2));
};
