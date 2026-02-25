import type Color from "colorjs.io";
import type { DesignTokensCollection } from "../../../../../../../shared/dtcg/resolver/design-tokens-collection.ts";
import type { GenericDesignTokensCollectionToken, GenericDesignTokensCollectionTokenWithType } from "../../../../../../../shared/dtcg/resolver/token/design-tokens-collection-token.ts";
import { defaultXCAssets, type XCAssetsColor, type XCAssetsColorSet } from "./XCAssetsIntefaces.ts";
import { colorDesignTokenValueToColorJs } from "../../../../../../../shared/dtcg/design-token/token/types/base/types/color/value/to/colorjs/color-design-token-value-to-color-js.ts";

interface FileToWrite {
    path: string;
    content: string;
}

export function processColorToken(
    resolvedToken: GenericDesignTokensCollectionTokenWithType,
    outputDirectory: string,
    colorsByFolder: Record<string, string[]>,
): FileToWrite {
    const filteredName = resolvedToken.name.filter((part) => part !== 'color');
    const folderName = filteredName[0];
    const colorsetName = filteredName.join('');
    const color: Color = colorDesignTokenValueToColorJs(resolvedToken.value, resolvedToken);
    const colorSetContents = createXCAssetsColorSet(color);

    if (!colorsByFolder[folderName]) {
        colorsByFolder[folderName] = [];
    }
    colorsByFolder[folderName].push(colorsetName);

    return {
        path: `${outputDirectory}/ios/Colors.xcassets/${folderName}/${colorsetName}.colorset/Contents.json`,
        content: JSON.stringify(colorSetContents, null, 2),
    };
}

function createXCAssetsColorSet(color: Color): XCAssetsColorSet {
    if (color.space.name.toLowerCase() != 'srgb') {
        throw new Error(`Unsupported color space: ${color.space.name}`);
    }

    const hexString = color.toString({ format: 'hex', collapse: false });
    const hexParts = hexString.slice(1).match(/.{2}/g)!;

    const swiftColors: XCAssetsColor = {
        color: {
            'color-space': color.space.name,
            components: {
                red: `0x${hexParts[0]}`,
                green: `0x${hexParts[1]}`,
                blue: `0x${hexParts[2]}`,
                alpha: hexParts[3] === undefined ? '0xFF' : `0x${hexParts[3]}`,
            },
        },
        idiom: 'universal',
    };

    return {
        colors: [swiftColors],
        info: defaultXCAssets,
    };
}