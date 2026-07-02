export interface IconifyApiIconListIcon {
  readonly name: string;
  readonly categories: ReadonlySet<string>;
}

export type IconifyApiIconList = readonly IconifyApiIconListIcon[];
