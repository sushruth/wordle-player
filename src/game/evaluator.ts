import { getLetterIndices } from "../common/helpers";
import { setFilteredWords } from "../player/state";
import { Result, Word } from "../common/types";
import { words } from "../common/words";

let referenceWord: Word = words[Math.floor(Math.random() * words.length)];
let referenceIndices = getLetterIndices(referenceWord);

export function newGame() {
  setFilteredWords(words);
  referenceWord = words[Math.floor(Math.random() * words.length)]
  console.log("New game - ", referenceWord);
}

export function isTheWord(input: Word) {
  const result: Result[] = [];

  for (let i = 0; i < input.length; i++) {
    const letter = input[i];
    const referenceIndex = referenceIndices.get(letter);

    if (!referenceIndex) {
      // black
      result[i] = Result.Black;
    } else {
      if (referenceIndex.includes(i)) {
        result[i] = Result.Green;
      } else {
        result[i] = Result.Yellow;
      }
    }
  }

  return result;
}
