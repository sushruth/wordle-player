import { Letter, Word } from "../../game/types";

export type LetterPositionScore = [
  Record<Letter, number>,
  Record<Letter, number>,
  Record<Letter, number>,
  Record<Letter, number>,
  Record<Letter, number>
];

export function getLPScore(referenceList: Word[]) {
  const letterPositionScore: LetterPositionScore = [{}, {}, {}, {}, {}];

  for (const word of referenceList) {
    for (let i = 0; i < word.length; i++) {
      letterPositionScore[i][word[i]] =
        (letterPositionScore[i][word[i]] || 0) + 1;
    }
  }

  return letterPositionScore;
}

export function getLPWordScores(
  filteredWordList: Word[],
  letterPositionScore: LetterPositionScore
) {
  const wordScores: Map<Word, number> = new Map();
  let highestScore = 0;
  for (const word of filteredWordList) {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
      count += letterPositionScore[i][word[i]] || 0;
    }
    if (highestScore < count) {
      highestScore = count;
    }
    wordScores.set(word, count);
  }

  return [wordScores, highestScore] as const;
}
