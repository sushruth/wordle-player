const itemIndexMap: Map<unknown[], number> = new Map();

export function getNextItem<T>(list: T[]) {
  const index = itemIndexMap.get(list) || 0;
  itemIndexMap.set(list, index + 1); // store next index
  return list[index];
}
