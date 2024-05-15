const RESULT = require('./result.json');
const qs = `?version=${process.env.GIT_HASH}`;

const SCREEN_BREAK_POINT = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

const getSizeName = (width) => {
    const breakpoints = Object.keys(SCREEN_BREAK_POINT);

    for (const breakpoint of breakpoints) {
        if (width <= SCREEN_BREAK_POINT[breakpoint]) {
            return breakpoint;
        }
    }

    return 'optimized';
};

export default function NextCustomImageLoader({ src, width }) {
    const regex = /\/_next\/static\/media\/([^\/.]+)\.[^\/.]+(\.\w+)?$/;

    const isModuleImportMatch = src.match(regex);

    if (process.env.NODE_ENV === 'development') return src;

    if (isModuleImportMatch) {
        const fileName = isModuleImportMatch[1];
        const sizeName = getSizeName(width);

        if (RESULT[fileName]) {
            const fileSrc = RESULT[fileName][sizeName];

            if (fileSrc) {
                return fileSrc + qs;
            } else {
                console.error(
                    `Image size ${sizeName} not found for ${fileName} in result.json`,
                );
            }
        }

        return src + qs;
    }

    return src + qs;
}
