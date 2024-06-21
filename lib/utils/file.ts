import path from "path";

export const getFileName = (filePath: string) => {
  return path.basename(filePath, path.extname(filePath));
};
