import { Letter, ResultColor, Word, WordResult } from "../../game/types";

export function getLetterPositionScoreBasedNextWord(
  filteredWordList: Word[],
  guessResult: WordResult
) {
  const [newList, score, letterPositionScore] =
    getLetterPositionBasedRankedList(filteredWordList, guessResult);

  return newList[0];
}

function getLetterPositionBasedRankedList(
  filteredWordList: Word[],
  guessResult: WordResult,
  referenceList = filteredWordList
) {
  const letterPositionScore: Record<Letter, number>[] = [{}, {}, {}, {}, {}];

  for (const word of referenceList) {
    for (let i = 0; i < word.length; i++) {
      if (guessResult.length && guessResult[i].color === ResultColor.Green) {
        continue;
      }

      letterPositionScore[i][word[i]] =
        (letterPositionScore[i][word[i]] || 0) + 1;
    }
  }

  const scores: Map<Word, number> = new Map();
  for (const word of filteredWordList) {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
      count += letterPositionScore[i][word[i]] || 0;
    }
    scores.set(word, count);
  }

  const sortedList = filteredWordList.sort(
    (a, b) => (scores.get(b) || 0) - (scores.get(a) || 0)
  );

  return [sortedList, scores, letterPositionScore] as const;
}
