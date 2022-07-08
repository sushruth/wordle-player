import { getIndices } from "../common/getLetterIndices";
import { prettyPrintResult } from "../common/prettyPrintResult";
import { words } from "../words";
import { ResultColor, Word, WordResult } from "./types";

let goalWord: Word = "";

export function startNewGame() {
  goalWord = words[Math.floor(Math.random() * words.length)];
  prettyPrintResult(goalWord.toUpperCase(), []);
  console.log("\n");
}

export function isThisTheWord(input: Word): WordResult {
  debugger;
  const result: WordResult = new Array(input.length);

  const handledIndices = new Set();

  // green and black loop
  for (let i = 0; i < input.length; i++) {
    const letter = input[i];
    if (goalWord[i] === letter) {
      result[i] = {
        index: i,
        letter,
        color: ResultColor.Green,
      };
      handledIndices.add(i);
    } else if (!goalWord.includes(letter)) {
      result[i] = {
        color: ResultColor.Black,
        letter,
        index: i,
      };
      handledIndices.add(i);
    }
  }

  // yellow loop
  for (let i = 0; i < input.length; i++) {
    if (!handledIndices.has(i)) {
      const letter = input[i];

      const goalLetterIndices = getIndices(goalWord, letter);
      const inputLetterIndices = getIndices(input, letter);

      const adjustedGoalLetterIndices = goalLetterIndices.filter(
        (index) => !inputLetterIndices.includes(index)
      );
      const adjustedInputLetterIndices = inputLetterIndices.filter(
        (index) =>
          !goalLetterIndices.includes(index) && !handledIndices.has(index)
      );

      if (adjustedGoalLetterIndices.length) {
        for (const index of adjustedInputLetterIndices) {
          if (!result[index] && !handledIndices.has(i)) {
            // this has not been handled yet. its a yellow then.
            result[i] = {
              color: ResultColor.Yellow,
              letter,
              index: i,
            };
            handledIndices.add(i);
          } else {
            result[i] = {
              color: ResultColor.Black,
              letter,
              index: i,
            };
            handledIndices.add(i);
          }
        }
      } else {
        result[i] = {
          color: ResultColor.Black,
          letter,
          index: i,
        };
        handledIndices.add(i);
      }
    }
  }

  return result;
}
