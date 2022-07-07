import { Letter, Word } from "./types";

export function getLetterIndices(word: Word) {
  return word.split("").reduce((acc, value, index) => {
    const existingValue = acc.get(value);
    if (existingValue) {
      acc.set(value, existingValue.concat(index));
    } else {
      acc.set(value, [index]);
    }
    return acc;
  }, new Map<Letter, number[]>());
}
