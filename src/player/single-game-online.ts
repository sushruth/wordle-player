import { LetterResult, ResultColor, Word, WordResult } from "../game/types";
import { words } from "../words";
import { prompt } from "./helpers/prompt";
import { playSingleRound } from "./single-round";

const resultColorLetterMap = {
  Y: ResultColor.Yellow,
  G: ResultColor.Green,
  B: ResultColor.Black,
};

async function getWordleResultFromUser(guessedWord: Word) {
  let resultLetters = "";
  while (resultLetters.length !== 5) {
    resultLetters = (await prompt("What result did you get ? - ")).trim();
  }

  const guessResult = resultLetters
    .toUpperCase()
    .split("")
    .map((letter, index): LetterResult => {
      if (letter in resultColorLetterMap) {
        const resultLetter = letter as keyof typeof resultColorLetterMap;

        return {
          color: resultColorLetterMap[resultLetter],
          index,
          letter: guessedWord[index],
        };
      } else {
        throw Error(`Unknown result letter ${letter}`);
      }
    });

  return guessResult;
}

export async function playForWordle() {
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
      const result = await playSingleRound(
        {
          attemptCount,
          filteredWordList,
          greenResults,
          guessedWordHistory,
          resultGetter: getWordleResultFromUser,
        },
        true
      );

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
