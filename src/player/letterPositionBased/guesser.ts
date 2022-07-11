import { Word, WordResult } from "../../game/types";
import { getLPScore, getLPWordScores } from "./score";

export function getLetterPositionScoreBasedNextWord(
  filteredWordList: Word[],
  guessResult: WordResult
) {
  const [higScoreWords] = getLetterPositionBasedRankedList(
    filteredWordList,
    guessResult
  );

  if (higScoreWords.length > 1 && higScoreWords.length < 10) {
    // This means every item in the list is equally probable now. TODO
  }

  return higScoreWords[0];
}

function getLetterPositionBasedRankedList(
  filteredWordList: Word[],
  guessResult: WordResult,
  referenceList = filteredWordList
) {
  const letterPositionScore = getLPScore(referenceList);
  const [wordScores, highestScore] = getLPWordScores(
    filteredWordList,
    letterPositionScore
  );

  const highScoreList = filteredWordList
    .filter((word) => wordScores.get(word) === highestScore)
    .sort((a, b) => (wordScores.get(b) || 0) - (wordScores.get(a) || 0));

  return [highScoreList, wordScores, letterPositionScore] as const;
}
