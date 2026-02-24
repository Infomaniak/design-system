export function getCliArgValue(args: readonly string[], name: string): string | undefined {
  const prefix: string = `${name}=`;

  const arg: string | undefined = args.find((value: string): boolean => {
    return value.startsWith(prefix);
  });

  return arg === undefined ? undefined : arg.slice(prefix.length);
}
