import { prettyPrintResult } from "../common/prettyPrintResult";
import { isThisTheWord, startNewGame } from "../game/evaluator";
import { ResultColor, Word, WordResult } from "../game/types";
import { words } from "../words";
import { getFilteredWordList } from "./filter";

function playTheGame() {
  debugger;
  startNewGame();

  let attemptCount = 0;
  let filteredWordList: Word[] = [...words];
  let guessResult: WordResult = [];
  let lastFilteredListLength = filteredWordList.length;
  let sameLengthAttempts = 0;
  let wordToPick = 0;

  let cumulativeResult: WordResult = [];
  while (
    !guessResult.length ||
    !guessResult.every((r) => r.color === ResultColor.Green)
  ) {
    const nextGuess = attemptCount
      ? filteredWordList[wordToPick]
      : filteredWordList[Math.floor(Math.random() * filteredWordList.length)];

    if (!nextGuess) {
      console.log(filteredWordList, wordToPick, guessResult);
      throw Error("No guess left!");
    }

    guessResult = isThisTheWord(nextGuess);
    attemptCount++;

    prettyPrintResult(nextGuess, guessResult);

    const oldFilteredList = filteredWordList.slice();
    filteredWordList = getFilteredWordList([...filteredWordList], guessResult);

    if (filteredWordList.length < 1 || sameLengthAttempts > 10) {
      console.log(oldFilteredList, guessResult);
      throw Error("This is not right");
    }

    if (lastFilteredListLength === filteredWordList.length) {
      sameLengthAttempts++;
      wordToPick++;
    } else {
      sameLengthAttempts = 0;
      wordToPick = 0;
    }

    lastFilteredListLength = filteredWordList.length;
  }

  return attemptCount;
}

const attemptCountList: number[] = [];
for (let i = 0; i < 1000; i++) {
  console.log(`\n===\n`);
  attemptCountList.push(playTheGame());
}

console.log(`\n===\n`);

const sortedAttemptsList = attemptCountList.sort((a, b) => b - a);
const maxAttempts = sortedAttemptsList[0];
const minAttempts = sortedAttemptsList[sortedAttemptsList.length - 1];
const averageAttemptsList = attemptCountList.reduce(
  (acc, v) => acc + v / attemptCountList.length,
  0
);

console.log(`\nStats - \n`);
console.log({
  maxAttempts,
  minAttempts,
  averageAttemptsList,
  totalGamesPlayed: attemptCountList.length,
});
