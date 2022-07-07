import pc from "picocolors";
import { Letter, Result } from "../common/types";
import { isTheWord, newGame } from "../game/evaluator";
import {
  filteredWords,
  getNewRandomFilteredWord,
  latestGuess,
  setFilteredWords,
} from "./state";

function getResultMap(results: Result[]) {
  const resultMap: Map<Result, { letter: Letter; index: number }[]> = new Map();
  for (let i = 0; i < results.length; i++) {
    const resultItem = results[i];
    resultMap.set(
      resultItem,
      (resultMap.get(resultItem) || []).concat({
        letter: latestGuess[i],
        index: i,
      })
    );
  }
  return resultMap;
}

function filterWordList(results: Result[]) {
  const resultMap = getResultMap(results);
  const greenResults = resultMap.get(Result.Green);
  const yellowResults = resultMap.get(Result.Yellow);
  const yellowResultCount: number[] = [];
  const blackResults = resultMap.get(Result.Black);

  const newFilteredWords = filteredWords.filter((word, i) => {
    yellowResultCount[i] = 0;
    // must have same letters as guess in green locations
    if (greenResults) {
      for (const entry of greenResults) {
        if (word[entry.index] !== entry.letter) {
          return false;
        }
      }
    }

    if (yellowResults) {
      for (const entry of yellowResults) {
        if (word.includes(entry.letter)) {
          yellowResultCount[i]++;
          // must not have same letters as guess in yellow locations
        } else if (word[entry.index] === entry.letter) {
          return false;
        }
      }
    }

    // must not have any letters in black locations
    if (blackResults) {
      for (const entry of blackResults) {
        if (word.includes(entry.letter)) {
          return false;
        }
      }
    }

    return true;
  });

  setFilteredWords(newFilteredWords);
}

const colorFnMap = {
  [Result.Black]: (v: string) => pc.bgBlack(pc.white(` ${v} `)),
  [Result.Green]: (v: string) => pc.bgGreen(pc.white(` ${v} `)),
  [Result.Yellow]: (v: string) => pc.bgYellow(pc.white(` ${v} `)),
};

function guess() {
  let result: Result[] = [Result.Yellow];

  let attempts = 0;
  while (filteredWords.length > 1) {
    attempts++;
    const newGuess = getNewRandomFilteredWord();

    result = isTheWord(newGuess);

    console.log(result.map((v, i) => colorFnMap[v](newGuess[i])).join(""));

    filterWordList(result);
  }

  console.log("Success! Found the word - ", latestGuess);

  return attempts;
}

const attemptList: number[] = [];
for (let i = 0; i < 10; i++) {
  newGame();
  attemptList.push(guess());
}

const sortedAttemptsList = attemptList.sort((a, b) => b - a);
const maxAttempts = sortedAttemptsList[0];
const minAttempts = sortedAttemptsList[sortedAttemptsList.length - 1];
const averageAttemptsList = attemptList.reduce(
  (acc, v) => acc + v / attemptList.length,
  0
);

console.log({
  maxAttempts,
  minAttempts,
  averageAttemptsList,
  totalGamesPlayed: attemptList.length,
});
