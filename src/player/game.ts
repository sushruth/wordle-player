import { prettyPrintResult } from "../common/prettyPrintResult";
import { isThisTheWord, setUpANewGame } from "../game/evaluator";
import { LetterResult, ResultColor, Word, WordResult } from "../game/types";
import { words } from "../words";
import { getFilteredWordList } from "./filter";
import { getLPSVariantNextWord } from "./letterPositionBased/variant/guesser";

export async function playTheGame(sequential = false) {
  setUpANewGame(sequential);

  let attemptCount = 0;
  let filteredWordList: Word[] = [...words];
  let guessResult: WordResult = [];
  let guessedWord = "";
  let guessedWordHistory: Word[] = [];
  let greenResults: LetterResult[] = [];

  try {
    while (
      !guessResult.length ||
      !guessResult.every((r) => r.color === ResultColor.Green)
    ) {
      attemptCount++;

      guessedWord = await getLPSVariantNextWord(
        filteredWordList,
        guessedWordHistory,
        greenResults
      );

      guessedWordHistory.push(guessedWord);
      guessResult = isThisTheWord(guessedWord);

      greenResults.push(
        ...guessResult.filter((r) => r.color === ResultColor.Green)
      );

      prettyPrintResult(guessedWord, guessResult, attemptCount);

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
