import { prettyPrintResult } from "../common/prettyPrintResult";
import { isThisTheWord, setUpANewGame } from "../game/evaluator";
import { ResultColor, Word, WordResult } from "../game/types";
import { words } from "../words";
import { getFilteredWordList } from "./filter";

export function playTheGame() {
  setUpANewGame();

  let attemptCount = 0;
  let filteredWordList: Word[] = [...words];
  let guessResult: WordResult = [];

  while (
    !guessResult.length ||
    !guessResult.every((r) => r.color === ResultColor.Green)
  ) {
    attemptCount++;

    const nextGuess =
      filteredWordList[Math.floor(Math.random() * filteredWordList.length)];
    guessResult = isThisTheWord(nextGuess);

    prettyPrintResult(nextGuess, guessResult);

    filteredWordList = getFilteredWordList([...filteredWordList], guessResult);
  }

  return attemptCount;
}
