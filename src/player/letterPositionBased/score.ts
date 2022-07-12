import { Letter, Word } from "../../game/types";

export type LetterPositionScore = [
  Record<Letter, number>,
  Record<Letter, number>,
  Record<Letter, number>,
  Record<Letter, number>,
  Record<Letter, number>
];

export function getLPScore(
  referenceList: Word[],
  excludePositions: Set<number> = new Set()
) {
  const letterPositionScore: LetterPositionScore = [{}, {}, {}, {}, {}];

  for (const word of referenceList) {
    for (let i = 0; i < word.length; i++) {
      if (excludePositions.has(i)) continue;
      letterPositionScore[i][word[i]] =
        (letterPositionScore[i][word[i]] || 0) + 1;
    }
  }

  return letterPositionScore;
}

export function getLPSScoreArray(input: LetterPositionScore) {
  let scoreArray: Record<string, number>[] = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    for (const key of Object.keys(item)) {
      const score = item[key];
      scoreArray[score] = {
        ...scoreArray[score],
        [key]: i,
      };
    }
  }
  return scoreArray.slice(1);
}

export function getScoreArrayLetters(scoreArray: Record<string, number>[]) {
  let letters = new Set<Letter>();
  for (const item of scoreArray) {
    if (item) {
      for (const key of Object.keys(item)) {
        letters.add(key);
      }
    }
  }
  return letters;
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

export function getBestEliminatingWord(wordList: Word[], letters: Letter[]) {
  const wordScores = new Map<Word, number>();

  let highestScore = 0;
  let highestScoreWord = "";
  for (const word of wordList) {
    let originalWord = word;
    let score = 0;
    for (let i = 0; i < letters.length; i++) {
      if (word.includes(letters[i])) {
        score++;
        word.replace(letters[i], "");
      }
    }
    if (highestScore < score) {
      highestScore = score;
      highestScoreWord = originalWord;
    }
    wordScores.set(originalWord, score);
  }

  return highestScoreWord;
}
