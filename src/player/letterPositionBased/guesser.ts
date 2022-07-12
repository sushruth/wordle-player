import { ResultColor, Word, WordResult } from "../../game/types";
import { words } from "../../words";
import {
  getBestEliminatingWord,
  getLPScore,
  getLPSScoreArray,
  getLPWordScores,
  getScoreArrayLetters,
} from "./score";

export function getLetterPositionScoreBasedNextWord(
  filteredWordList: Word[],
  guessResult: WordResult
) {
  const [highScoreWords, wordScores, lps] = getLetterPositionBasedRankedList(
    filteredWordList,
    guessResult
  );

  if (highScoreWords.length > 1 && highScoreWords.length < 50) {
    const scoreArray = getLPSScoreArray(lps);

    if (scoreArray.length === 1) {
      // This means every item in the list is equally probable now.
      const includeLetters = [...getScoreArrayLetters(scoreArray)];
      const word = getBestEliminatingWord(words, includeLetters);
      return word;
    }
  }

  return highScoreWords[0];
}

function getLetterPositionBasedRankedList(
  filteredWordList: Word[],
  guessResult: WordResult,
  referenceList = filteredWordList
) {
  const letterPositionScore = getLPScore(
    referenceList,
    new Set(
      guessResult
        .filter((r) => r.color === ResultColor.Green)
        .map((r) => r.index)
    )
  );
  const [wordScores, highestScore] = getLPWordScores(
    filteredWordList,
    letterPositionScore
  );

  const highScoreList = filteredWordList
    .filter((word) => wordScores.get(word) === highestScore)
    .sort((a, b) => (wordScores.get(b) || 0) - (wordScores.get(a) || 0));

  return [highScoreList, wordScores, letterPositionScore] as const;
}
