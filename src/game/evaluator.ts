import { getNextItem } from "../common/getNextItem";
import { getRandomItem } from "../common/getRandomItem";
import { log } from "../common/logger";
import { prettyPrintResult } from "../common/prettyPrintResult";
import { moreWords, words } from "../words";
import { ResultColor, Word, WordResult } from "./types";

let goalWord: Word = "";
export function setUpANewGame(sequential = false) {
  goalWord = sequential ? getNextItem(words) : getRandomItem(words);
  goalWord = "catch";
  prettyPrintResult(goalWord.toUpperCase(), [], "»");
  log("\n");
}

export function isThisTheWord(input: Word): WordResult {
  if (!words.includes(input) && !moreWords.includes(input)) {
    if (input) {
      throw Error(`"${input}" is not a valid word*`);
    } else {
      throw Error(`Empty input received`);
    }
  }

  const result: WordResult = new Array(input.length);

  let goalWordCopy = goalWord.slice();

  // green and black loop
  for (let index = 0; index < input.length; index++) {
    const letter = input[index];
    if (goalWord[index] === letter) {
      result[index] = {
        index,
        letter,
        color: ResultColor.Green,
      };
      goalWordCopy = goalWordCopy.replace(letter, "-");
    } else if (!goalWord.includes(letter)) {
      result[index] = {
        color: ResultColor.Black,
        letter,
        index,
      };
      goalWordCopy = goalWordCopy.replace(letter, "-");
    }
  }

  // yellow loop
  for (let index = 0; index < input.length; index++) {
    if (!result[index]) {
      const letter = input[index];

      if (goalWordCopy.includes(letter)) {
        result[index] = {
          color: ResultColor.Yellow,
          index,
          letter,
        };
        goalWordCopy = goalWordCopy.replace(letter, "-");
      } else {
        result[index] = {
          color: ResultColor.Black,
          index,
          letter,
        };
        goalWordCopy = goalWordCopy.replace(letter, "-");
      }
    }
  }

  return result;
}
