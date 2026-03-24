import type { TransformedToken } from 'style-dictionary/types';
import { T1_DIRECTORY_NAME, T2_DIRECTORY_NAME, T3_DIRECTORY_NAME } from './helpers.ts';

export const XCASSETS_INFO = { author: 'esds', version: 1 };

/** Maps DTCG token type → Swift type string. */
export const TYPE_SWIFT_MAP: Record<string, string> = {
    color: 'Color', dimension: 'CGFloat', number: 'CGFloat',
    fontFamily: 'String', fontWeight: 'Font.Weight',
};

export interface SwiftProperty {
    name: string;
    type: string;
    value: string;
    category: string;
}

export interface TokenLeaf {
    kind: 'leaf';
    token: TransformedToken;
    value: string;
    swiftType: string;
}

export interface TokenBranch {
    kind: 'branch';
    children: Map<string, TokenNode>;
}

export type TokenNode = TokenLeaf | TokenBranch;

export const STATE_KEYS = new Set(['default', 'hover', 'pressed']);
export const INLINE_TYPES = new Set(['CGFloat', 'String', 'Font.Weight']);

const FONT_WEIGHT_MAP: Record<number, string> = {
    100: '.ultraLight', 200: '.thin', 300: '.light', 400: '.regular', 500: '.medium',
    600: '.semibold', 700: '.bold', 800: '.heavy', 900: '.black',
};

/** Strips non-alphanumeric chars and converts kebab-case → camelCase. */
function cleanSegment(s: string): string {
    return s.replace(/[^a-zA-Z0-9-]/g, '').replace(/-([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
}

/** Path → Swift camelCase id, e.g. ['color', 'red', '500'] → 'colorRed500' */
function toSwiftName(path: string[]): string {
    return path
        .map((s, i) => {
            const c = cleanSegment(s);
            return i === 0 ? c : c.charAt(0).toUpperCase() + c.slice(1);
        })
        .join('');
}

function isT1Token(token: TransformedToken): boolean {
    return (token.filePath ?? '').includes(T1_DIRECTORY_NAME);
}

function isTokenReference(value: unknown): value is string {
    return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

function xcassetsColorRefFromPath(path: string[]): string {
    const isColorNamespace = path[0] === 'color';
    const name = isColorNamespace ? path.slice(1).join('') : path.join('');
    return `Color("${name}")`;
}

function xcassetsColorRef(token: TransformedToken): string {
    return xcassetsColorRefFromPath(token.path);
}

function resolveColorExpression(
    token: TransformedToken,
    bySwiftName: Map<string, TransformedToken>,
    depth = 0,
): string {
    if (depth > 10) return '.clear';

    const original = token.original?.$value;
    if (!isTokenReference(original)) {
        if (isT1Token(token)) return xcassetsColorRef(token);
        return '.clear';
    }

    const refPath = original.slice(1, -1).split('.');
    const refName = toSwiftName(refPath);
    const refToken = bySwiftName.get(refName);

    if (refToken) {
        if (isT2Token(refToken)) return `Self.${refName}`;
        return resolveColorExpression(refToken, bySwiftName, depth + 1);
    }

    return xcassetsColorRefFromPath(refPath);
}

/** Single segment → camelCase property name. Prefixes leading digit with '_'. */
export function toPropertyName(segment: string): string {
    const c = cleanSegment(segment);
    return /^\d/.test(c) ? `_${c}` : c;
}

/** Path prefix → PascalCase struct name, e.g. ['EsdsTheme','color','bg'] → 'EsdsThemeColorBg' */
export function toStructName(prefix: string[]): string {
    return prefix
        .map((s, i) => {
            const c = cleanSegment(s);
            return i === 0 || /^\d/.test(c) ? c : c.charAt(0).toUpperCase() + c.slice(1);
        })
        .join('');
}

export function isT2Token(token: TransformedToken): boolean {
    return (token.filePath ?? '').includes(T2_DIRECTORY_NAME);
}

export function tokenToSwiftProperty(
    token: TransformedToken,
    lightBySwiftName: Map<string, TransformedToken>,
    darkBySwiftName: Map<string, TransformedToken>,
): SwiftProperty | null {
    if (!isT2Token(token)) return null;

    const type = token.$type || token.type || '';
    const swiftType = TYPE_SWIFT_MAP[type];
    if (!swiftType) return null;

    const value = token.$value ?? token.value;
    const name = toSwiftName(token.path);
    const category = token.path[0] ?? '';

    switch (type) {
        case 'color': {
            const darkToken = darkBySwiftName.get(name);
            const lightExpr = resolveColorExpression(token, lightBySwiftName);
            const darkExpr = darkToken ? resolveColorExpression(darkToken, darkBySwiftName) : lightExpr;
            const colorValue = lightExpr === darkExpr ? lightExpr : `Color(light: ${lightExpr}, dark: ${darkExpr})`;
            return { name, type: 'Color', value: colorValue, category };
        }
        case 'dimension':
        case 'number': {
            const raw = token.$value ?? token.value;
            const num = typeof raw === 'object' && raw !== null && 'value' in raw
                ? Number(raw.value)
                : typeof raw === 'number' ? raw : parseFloat(String(raw));
            return isNaN(num) ? null : { name, type: 'CGFloat', value: String(num), category };
        }
        case 'fontFamily':
            return { name, type: 'String', value: `"${String(value)}"`, category };
        case 'fontWeight': {
            const num = typeof value === 'number' ? value : parseInt(String(value), 10);
            const w = FONT_WEIGHT_MAP[num];
            return w ? { name, type: 'Font.Weight', value: w, category } : null;
        }
        default:
            return null;
    }
}

export function typographyToSwiftLines(token: TransformedToken): string[] {
    const typography = token.$value ?? token.value;
    if (!typography || typeof typography !== 'object') return [];

    const value = typography as {
        fontFamily?: unknown;
        fontSize?: unknown;
        fontWeight?: unknown;
        lineHeight?: unknown;
    };

    const fontFamily = `"${String(value.fontFamily ?? '')}"`;
    const fontSize = String(parseFloat(String(value.fontSize ?? 0)));
    const fontWeightNum = typeof value.fontWeight === 'number'
        ? value.fontWeight
        : parseInt(String(value.fontWeight ?? 400), 10);
    const fontWeight = FONT_WEIGHT_MAP[fontWeightNum] ?? '.regular';
    const lineHeight = String(parseFloat(String(value.lineHeight ?? 0)));

    const name = toSwiftName(token.path);
    return [
        `    public static let ${name} = EsdsTypography(`,
        `        fontFamily: ${fontFamily},`,
        `        fontSize: ${fontSize},`,
        `        fontWeight: ${fontWeight},`,
        `        lineHeight: ${lineHeight}`,
        '    )',
    ];
}

export function indexByName(tokens: TransformedToken[]): Map<string, TransformedToken> {
    return new Map(tokens.map(t => [t.name, t]));
}

export function indexBySwiftName(map: Map<string, TransformedToken>): Map<string, TransformedToken> {
    return new Map([...map.values()].map(t => [toSwiftName(t.path), t]));
}

export function isSemanticOrComponent(token: TransformedToken): boolean {
    const fp = token.filePath ?? '';
    return fp.includes(T2_DIRECTORY_NAME) || fp.includes(T3_DIRECTORY_NAME) || fp.includes('modifiers');
}

export function resolvedEsdsRef(
    token: TransformedToken,
    bySwiftName: Map<string, TransformedToken>,
    depth = 0,
): string {
    if (depth > 10) return `EsdsTokens.${toSwiftName(token.path)}`;
    if (isT2Token(token)) return `EsdsTokens.${toSwiftName(token.path)}`;

    const orig = token.original?.$value;
    if (isTokenReference(orig)) {
        const name = toSwiftName(orig.slice(1, -1).split('.'));
        const ref = bySwiftName.get(name);
        if (ref) return resolvedEsdsRef(ref, bySwiftName, depth + 1);
        if (orig.startsWith('{color.')) {
            const path = orig.slice(1, -1).split('.');
            return `Color("${path.slice(1).join('')}")`;
        }
        return `EsdsTokens.${name}`;
    }

    if ((token.$type || token.type) === 'color' && token.path[0] === 'color') {
        return `Color("${token.path.slice(1).join('')}")`;
    }

    return `EsdsTokens.${toSwiftName(token.path)}`;
}
