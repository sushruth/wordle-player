import { prettyPrintResult } from "../common/prettyPrintResult";
import { isThisTheWord, setUpANewGame } from "../game/evaluator";
import { ResultColor, Word, WordResult } from "../game/types";
import { words } from "../words";
import { getFilteredWordList } from "./filter";
import { getLetterPositionScoreBasedNextWord } from "./letterPositionBased/guesser";

export function playTheGame(sequential = false) {
  setUpANewGame(sequential);

  let attemptCount = 0;
  let filteredWordList: Word[] = [...words];
  let guessResult: WordResult = [];
  let guessedWord = "";

  try {
    while (
      !guessResult.length ||
      !guessResult.every((r) => r.color === ResultColor.Green)
    ) {
      attemptCount++;

      guessedWord = getLetterPositionScoreBasedNextWord(
        filteredWordList,
        guessResult
      );
      guessResult = isThisTheWord(guessedWord);

      prettyPrintResult(guessedWord, guessResult);

      filteredWordList = getFilteredWordList(
        [...filteredWordList],
        guessResult
      );
    }
  } catch (error) {
    console.log({
      guessedWord,
      guessResult,
      attemptCount,
      filteredWordList,
    });
    throw error;
  }

  return [attemptCount, guessedWord] as const;
}
