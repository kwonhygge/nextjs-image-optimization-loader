import fs from "fs";

export const createResizedFolderIfNotExists = (optimizedFolderPath: string) => {
  if (!fs.existsSync(optimizedFolderPath)) {
    fs.mkdirSync(optimizedFolderPath);
  }
};
