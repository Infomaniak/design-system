import type { IconifyApiListIconsResponse } from '../../../api/list-icons/iconify-api-list-icons-response.ts';
import type { IconifyApiIconList, IconifyApiIconListIcon } from './iconify-api-icon-list.ts';

export function iconifyApiListIconsResponseToIconifyApiIconList(
  response: IconifyApiListIconsResponse,
): IconifyApiIconList {
  const allIcons: Set<string> = new Set<string>();
  const iconNameToIconCategories: Map<string /* name */, Set<string>> = new Map<
    string,
    Set<string>
  >();

  if (response.uncategorized !== undefined) {
    for (const icon of response.uncategorized) {
      allIcons.add(icon);
    }
  }

  if (response.categories !== undefined) {
    for (const [category, icons] of Object.entries(response.categories)) {
      for (const icon of icons) {
        allIcons.add(icon);

        let categories: Set<string> | undefined = iconNameToIconCategories.get(icon);
        if (categories === undefined) {
          categories = new Set<string>();
          iconNameToIconCategories.set(icon, categories);
        }
        categories.add(category);
      }
    }
  }

  return Array.from(allIcons, (name: string): IconifyApiIconListIcon => {
    return {
      name,
      categories: iconNameToIconCategories.get(name) ?? new Set<string>(),
    };
  });
}
