import { AUTO_GENERATED_FILE_HEADER } from '../../../constants/auto-generated-file-header.ts';

export function createSwiftColorEnum(colorsByFolder: Record<string, string[]>): string {
  const nestedEnums = Object.entries(colorsByFolder)
    .map(([folder, names]) => {
      const cases = names.map((name) => `        case ${name}`).join('\n');

      return `    public enum ${folder}: String, CaseIterable {
${cases}

        public var color: Color {
            Color(rawValue)
        }
    }`;
    })
    .join('\n\n');

  const allByCategory = Object.keys(colorsByFolder)
    .map((folder) => `            ("${folder}", ${folder}.allCases.map(\\.color))`)
    .join(',\n');

  return `//
// ${AUTO_GENERATED_FILE_HEADER}
//

import SwiftUI

public enum EsdsColors {
${nestedEnums}

    public static var allByCategory: [(name: String, colors: [Color])] {
        [
${allByCategory}
        ].sorted { $0.colors.count > $1.colors.count }
    }
}
`;
}
