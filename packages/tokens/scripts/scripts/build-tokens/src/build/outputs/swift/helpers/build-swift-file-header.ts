import { AUTO_GENERATED_FILE_HEADER } from '../../../constants/auto-generated-file-header.ts';

const LICENSE_BODY_LINES: readonly string[] = [
  'Infomaniak Design System - iOS',
  `Copyright (C) ${new Date().getFullYear()} Infomaniak Network SA`,
  '',
  'This program is free software: you can redistribute it and/or modify',
  'it under the terms of the GNU General Public License as published by',
  'the Free Software Foundation, either version 3 of the License, or',
  '(at your option) any later version.',
  '',
  'This program is distributed in the hope that it will be useful,',
  'but WITHOUT ANY WARRANTY; without even the implied warranty of',
  'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the',
  'GNU General Public License for more details.',
  '',
  'You should have received a copy of the GNU General Public License',
  'along with this program.  If not, see <http://www.gnu.org/licenses/>.',
  '',
  AUTO_GENERATED_FILE_HEADER,
];

/**
 * GPLv3 license banner prepended to every generated Swift file. Each line is
 * prefixed with a single space to align with the opening `/*` delimiter.
 */
export const SWIFT_FILE_HEADER: string = `/*\n${LICENSE_BODY_LINES.map((line: string): string =>
  line.length === 0 ? '' : ` ${line}`,
).join('\n')}\n */`;
