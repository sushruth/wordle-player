import { Letter, Word } from "../game/types";

export function getIndices(word: Word, letter: Letter) {
  const indices: number[] = [];
  for (let i = 0; i < word.length; i++) {
    if (letter === word[i]) {
      indices.push(i);
    }
  }
  return indices;
}
