import { getRandomItem } from "../common/getRandomItem";
import { isThisTheWord } from "../game/evaluator";
import { Word } from "../game/types";
import { getFilteredWordList } from "./filter";
import { getHighestScoreWordsFromRankedList } from "./helpers/getHighestScoreWordsFromRankList";

export const getNextGuessRandom = getRandomItem;

export function getScoreBasedNextWord(filteredWordList: Word[]) {
  const [newWordList] = getScoreBasedSortedWordList(filteredWordList);
  return newWordList[0];
}

export function getCheatingBasedNextWord(filteredWordList: Word[]) {
  let [newWordList, scores] = getScoreBasedSortedWordList(filteredWordList);
  const highestScoreWords = getHighestScoreWordsFromRankedList(
    newWordList,
    scores
  );

  if (highestScoreWords.length > 1 && highestScoreWords.length < 5) {
    return getBestPathWord(highestScoreWords);
  }

  return highestScoreWords[0];
}

function getScoreBasedSortedWordList(filteredWordList: Word[]) {
  // calculate the most common letters in the wordList
  const letterCounts: { [key: string]: number } = {};
  for (const word of filteredWordList) {
    for (const letter of word) {
      if (!letterCounts[letter]) {
        letterCounts[letter] = 0;
      }
      letterCounts[letter]++;
    }
  }

  // find word with most common letters
  let scores: Map<Word, number> = new Map();
  for (const word of filteredWordList) {
    let count = 0;
    let lettersDone = new Set();
    for (const letter of word) {
      if (!lettersDone.has(letter)) {
        count += letterCounts[letter];
        lettersDone.add(letter);
      }
    }
    scores.set(word, count);
  }

  const sortedList = filteredWordList.sort(
    (a, b) => (scores.get(b) || 0) - (scores.get(a) || 0)
  );

  return [sortedList, scores] as const;
}

/**
 * Consults the game to find out which of the passed words will lead to least filtered words in the future and returns that word
 */
function getBestPathWord(words: Word[]) {
  let futureLength = Infinity;
  let bestPathWord = "";
  for (const word of words) {
    const potentialResult = isThisTheWord(word);
    const futureList = getFilteredWordList([...words], potentialResult);
    if (futureLength > futureList.length) {
      futureLength = futureList.length;
      bestPathWord = word;
    }
  }

  return bestPathWord;
}
