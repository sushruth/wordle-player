import { Letter, LetterResult, Score, Word } from "../../game/types";
import { moreWords, words } from "../../words";
import { getLPScore, LetterPositionScore } from "./lps-helpers/score";

export async function getLPSVariantNextWord(
  filteredWordList: Word[],
  guessedWordHistory: Word[],
  greenResults: LetterResult[]
) {
  if (filteredWordList.length === words.length) {
    return "saree"; // hardcoding first solution based on previous knowledge
  }

  const lps = getLPScore(filteredWordList);
  const { scoreMap, highestScore } = await getLpsWordMap(
    words,
    lps,
    greenResults
  );

  const { scoreMap: globalScoreMap, highestScore: globalHighestScore } =
    await getLpsWordMap(moreWords, lps, greenResults);

  if (filteredWordList.length > 1) {
    const highestScoreWords = getHighestScoreWords(scoreMap, highestScore);
    const globalHighestScoreWords = getHighestScoreWords(
      globalScoreMap,
      globalHighestScore
    );

    const listToUse =
      highestScore > globalHighestScore
        ? highestScoreWords
        : globalHighestScoreWords;

    const word = listToUse.filter((w) => !guessedWordHistory.includes(w))[0];

    if (word && !guessedWordHistory.includes(word)) {
      return word;
    }
  }

  return filteredWordList[0];
}

async function getLpsWordMap(
  wordList: Word[],
  lps: LetterPositionScore,
  greenResults: LetterResult[]
) {
  const scoreMap: Map<Word, Score> = new Map();
  const greenPositionLetters = greenResults.reduce((acc, r) => {
    acc[r.index] = (acc[r.index] || []).concat(r.letter);
    return acc;
  }, [] as string[][]);

  const greenLetters = greenPositionLetters.flatMap((item) => item);
  const lpsLetters = lps.flatMap((positionScore) =>
    Object.keys(positionScore).filter((v) => !greenLetters.includes(v))
  );

  let highestScore = 0;
  for (const originalWord of wordList) {
    let word = originalWord.slice();
    let score = 0;
    let seenLetters = new Set<Letter>();
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];

      if (greenPositionLetters[i]?.includes(letter)) {
        score -= 2;
      } else if (greenLetters.includes(letter)) {
        score -= 1;
      } else {
        let delta = lps[i][letter] || 0;
        if (seenLetters.has(letter)) {
          delta = delta - 2;
        }
        score += delta;
      }

      if (lpsLetters.includes(letter)) {
        score += 2;
      }

      seenLetters.add(letter);
    }

    if (highestScore <= score) {
      highestScore = score;
    }

    if (score) {
      scoreMap.set(originalWord, score);
    }
  }

  return { scoreMap, highestScore };
}

function getHighestScoreWords(scoreMap: Map<Word, Score>, highestScore: Score) {
  const highestScoreWords: Word[] = [];
  for (const [word, score] of scoreMap.entries()) {
    if (score === highestScore) {
      highestScoreWords.push(word);
    }
  }
  return highestScoreWords;
}
