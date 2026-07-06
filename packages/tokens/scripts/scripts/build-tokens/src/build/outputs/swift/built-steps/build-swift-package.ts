import { join } from 'node:path';
import { writeTextFileSafe } from '../../../../../../../../../../scripts/helpers/file/write-text-file-safe.ts';
import { dedent } from '../../../../../../../../../../scripts/helpers/misc/string/dedent/dedent.ts';
import {
  SWIFT_FOUNDATION_DIR,
  SWIFT_PACKAGE_NAME,
  SWIFT_PRIMITIVE_TARGET_NAME,
  SWIFT_PRODUCTS_DIR,
  SWIFT_SOURCES_DIR,
} from '../swift-constants.ts';

const SWIFT_TOOLS_VERSION = '6.2';
const SWIFT_PACKAGE_PLATFORMS = '[.iOS(.v16), .macOS(.v13), .visionOS(.v1)]';

export interface BuildSwiftPackageOptions {
  readonly outputDirectory: string;
  readonly productTargetNames: readonly string[];
}

function buildLibraryProduct(targetName: string): string {
  return dedent`
    .library(
      name: "${targetName}",
      targets: ["${targetName}"]
    ),
  `;
}

function buildProductTarget(targetName: string): string {
  return dedent`
    .target(
      name: "${targetName}",
      dependencies: ["${SWIFT_FOUNDATION_DIR}", "${SWIFT_PRIMITIVE_TARGET_NAME}"],
      path: "${SWIFT_SOURCES_DIR}/${SWIFT_PRODUCTS_DIR}/${targetName}"
    ),
  `;
}

export async function buildSwiftPackage({
  outputDirectory,
  productTargetNames,
}: BuildSwiftPackageOptions): Promise<void> {
  const libraryProducts = [SWIFT_FOUNDATION_DIR, ...productTargetNames]
    .map(buildLibraryProduct)
    .join('\n');
  const productTargets = productTargetNames.map(buildProductTarget).join('\n');

  const content = dedent`
    // swift-tools-version: ${SWIFT_TOOLS_VERSION}

    import PackageDescription

    let package = Package(
      name: "${SWIFT_PACKAGE_NAME}",
      platforms: ${SWIFT_PACKAGE_PLATFORMS},
      products: [
        ${libraryProducts}
      ],
      targets: [
        .target(
          name: "${SWIFT_PRIMITIVE_TARGET_NAME}",
          resources: [.process("Colors.xcassets")]
        ),
        .target(
          name: "${SWIFT_FOUNDATION_DIR}",
          dependencies: ["${SWIFT_PRIMITIVE_TARGET_NAME}"]
        ),
        ${productTargets}
      ]
    )
  `;

  await writeTextFileSafe(join(outputDirectory, 'Package.swift'), content);
}
