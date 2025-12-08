export function block<GReturn>(fnc: () => GReturn): GReturn {
  return fnc();
}
