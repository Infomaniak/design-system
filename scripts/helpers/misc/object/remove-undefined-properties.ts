export type RemoveUndefinedPropertiesOf<GInput extends object> = {
  [GKey in keyof GInput as GInput[GKey] extends undefined ? never : GKey]: GInput[GKey];
};

export function removeUndefinedProperties<GInput extends object>(
  input: GInput,
): RemoveUndefinedPropertiesOf<GInput> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]: [string, unknown]): boolean => {
      return value !== undefined;
    }),
  ) as RemoveUndefinedPropertiesOf<GInput>;
}
