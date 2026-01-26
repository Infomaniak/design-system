import Color from 'colorjs.io';

export const DEFAULT_FORMAT_COLOR_FUNCTION = (color: Color): string => {
  return color.toString(
    color.space.name === 'sRGB'
      ? { format: 'hex' }
      : {
          format: 'color',
        },
  );
};
