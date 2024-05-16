import {ImageInfo} from "../types/common";

export const updateImageInfo = (imageInfo: ImageInfo, fileName: string, breakpoint: string, fileSrc: string) => {
    imageInfo[fileName] = {
        ...imageInfo[fileName],
        [breakpoint]: fileSrc,
    };
};