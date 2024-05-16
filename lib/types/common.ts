export type ImageInfo = {
  [key: string]: {
    [key: string]: string;
  };
};

export type ProcessImageOptions = {
  validationOnly: boolean;
  screenBreakPoint: {
    [key: string]: number;
  };
  optimizedFolderPath: string;
  resultFilePath: string;
};
