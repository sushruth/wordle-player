export function getRandomItem<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}
