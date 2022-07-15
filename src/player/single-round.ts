import { log } from "../common/logger";
import { prettyPrintResult } from "../common/prettyPrintResult";
import { isThisTheWord } from "../game/evaluator";
import { LetterResult, ResultColor, Word, WordResult } from "../game/types";
import { getFilteredWordList } from "./filter";
import { getLPSVariantNextWord } from "./guessers/lps_guesser";

type SingleRoundParams = {
  attemptCount: number;
  filteredWordList: Word[];
  greenResults: LetterResult[];
  guessedWordHistory: Word[];
  resultGetter: (input: Word) => WordResult | Promise<WordResult>;
};

export async function playSingleRound(
  {
    attemptCount,
    filteredWordList,
    guessedWordHistory,
    greenResults,
    resultGetter,
  }: SingleRoundParams,
  showGuesses = false
): Promise<
  Omit<SingleRoundParams, "resultGetter"> & {
    guessedWord: Word;
    guessResult: WordResult;
  }
> {
  attemptCount++;

  const guessedWord = await getLPSVariantNextWord(
    filteredWordList,
    guessedWordHistory,
    greenResults
  );

  showGuesses && prettyPrintResult(guessedWord.toUpperCase(), [], "👉");

  guessedWordHistory.push(guessedWord);

  const newGuessResult = await resultGetter(guessedWord);

  greenResults.push(
    ...newGuessResult.filter((r) => r.color === ResultColor.Green)
  );

  prettyPrintResult(guessedWord, newGuessResult, attemptCount);

  filteredWordList = getFilteredWordList([...filteredWordList], newGuessResult);

  return {
    filteredWordList,
    attemptCount,
    greenResults,
    guessedWordHistory,
    guessResult: newGuessResult,
    guessedWord,
  };
}
