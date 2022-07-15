import { isThisTheWord } from "../game/evaluator";
import { LetterResult, ResultColor, Word, WordResult } from "../game/types";
import { words } from "../words";
import { playSingleRound } from "./single-round";

export async function playTheGame() {
  let attemptCount = 0;
  let filteredWordList: Word[] = [...words];
  let greenResults: LetterResult[] = [];
  let guessedWord = "";
  let guessedWordHistory: Word[] = [];
  let guessResult: WordResult = [];

  try {
    while (
      !guessResult.length ||
      !guessResult.every((r) => r.color === ResultColor.Green)
    ) {
      const result = await playSingleRound({
        attemptCount,
        filteredWordList,
        greenResults,
        guessedWordHistory,
        resultGetter: isThisTheWord,
      });
      attemptCount = result.attemptCount;
      filteredWordList = result.filteredWordList;
      greenResults = result.greenResults;
      guessedWord = result.guessedWord;
      guessedWordHistory = result.guessedWordHistory;
      guessResult = result.guessResult;
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
