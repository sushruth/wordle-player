import { Word } from "../../game/types";

/**
 * Returns only the highest scoring words (all words will have same highest score)
 */
export function getHighestScoreWordsFromRankedList(
  words: Word[],
  scores: Map<Word, number>
) {
  const highestScore = scores.get(words[0]) || 0;
  const highScoreWords = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const score = scores.get(word) || 0;
    highScoreWords.push(word);
    if (score < highestScore) {
      break;
    }
  }

  return highScoreWords;
}
