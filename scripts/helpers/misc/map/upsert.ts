export function mapGetOrInsert<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
  if (!map.has(key)) {
    map.set(key, defaultValue);
  }
  return map.get(key)!;
}

export function mapGetOrInsertComputed<K, V>(
  map: Map<K, V>,
  key: K,
  callbackFunction: (key: K) => V,
): V {
  if (!map.has(key)) {
    map.set(key, callbackFunction(key));
  }
  return map.get(key)!;
}
