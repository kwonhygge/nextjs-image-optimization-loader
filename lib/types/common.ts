export type ImageInfo = {
  [key: string]: {
    [key: string]: string;
  };
};

export type ProcessImageOptions = Options & {
  optimizedFolderPath: string;
  resultFilePath: string;
};

export type Options = {
  validationOnly?: boolean;
  screenBreakPoint?: {
    [key: string]: number;
  };
};
