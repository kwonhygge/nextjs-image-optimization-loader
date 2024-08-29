# WebP Image Optimizer Loader for Next.js

This Webpack loader optimizes images by converting them to WebP format and creating multiple sizes (responsive breakpoints) for use with the Next.js Image component. This allows the Next.js Image component's `loader` function to dynamically serve the appropriate image size based on the user's viewport, resulting in faster load times and improved performance.

## Features

- **Automatic WebP Conversion**: Automatically converts images to WebP format, a modern image format that provides superior compression.
- **Responsive Images**: Generates multiple image sizes based on predefined breakpoints (e.g., `sm`, `md`, `lg`, `xl`).
- **Seamless Integration**: Works out of the box with Next.js Image component by providing a custom `loader` function.

## Installation

To install the package, run:

```bash
npm install nextjs-image-optimization-loader
```

## Usage

1. Create Custom Image loader file for Nextjs Image component (This is useful when you want to add loader for every image component in project. If not, use loader property in Image component each)

in your root folder, add:

```javascript
// next-custom-image-loader.js
import RESULT from './result';

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
                return fileSrc;
            } else {
                console.error(
                    `Image size ${sizeName} not found for ${fileName} in result.json`,
                );
            }
        }

        return src;
    }

    return src;
}
```

2. Add these two inside `next.config.js`
```
    images: {
        loader: 'custom',
        loaderFile: './next-custom-image-loader.js',
        unoptimized: process.env.NODE_ENV === 'development',
    },

        webpack: (config, { dev, isServer }) => {

            config.module.rules.push({
            test: /\.(png|jpg|webp)$/i,
            use: [
                {
                    loader: 'nextjs-image-optimization-loader',
                    options: {
                        validationOnly:
                            process.env.SKIP_OPTIMIZATION === 'true'
                                ? true
                                : false,
                    },
                },
            ],
        });

        //Sometimes image file transformation stops because of cache
        config.cache = false;

        //Sometimes result.json file making stops because of webpack's paralle processing
        config.parallelism = 1;

      }
```

## Options
The loader accepts the following options:

	•	validationOnly: When set to true, the loader only validates images without processing.
	•	screenBreakPoint: An object defining custom breakpoints for responsive image generation. Default breakpoints are:
	•	  sm: 640px
	•	  md: 768px
	•	  lg: 1024px
	•	  xl: 1280px

## Contribution

Feel free to contribute to this project by submitting issues or pull requests. Your help is greatly appreciated!

## License

This project is licensed under the MIT License. See the LICENSE file for details.
