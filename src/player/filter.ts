import { LetterResult, ResultColor, Word, WordResult } from "../game/types";

export function getFilteredWordList(wordList: Word[], lastResult: WordResult) {
  const mappedResults: Record<ResultColor, LetterResult[]> = {
    [ResultColor.Black]: [],
    [ResultColor.Green]: [],
    [ResultColor.Yellow]: [],
  };

  for (const result of lastResult) {
    mappedResults[result.color].push(result);
  }

  const score = new Map<Word, number>();

  debugger;

  const newWordList = wordList.filter((word) => {
    const originalWord = word.slice();

    // must have all green letters
    for (const greenResult of mappedResults[ResultColor.Green]) {
      if (word[greenResult.index] !== greenResult.letter) {
        return false;
      } else {
        score.set(originalWord, (score.get(originalWord) || 0) + 1);
        word = word.replace(greenResult.letter, "-");
      }
    }

    // must have all yellow letters excluding green ones, in different indices than result has
    for (const yellowResult of mappedResults[ResultColor.Yellow]) {
      if (!word.includes(yellowResult.letter)) {
        return false;
      } else {
        for (let i = 0; i < word.length; i++) {
          const letter = word[i];
          if (i === yellowResult.index && letter === yellowResult.letter) {
            // must not have yellow in the same place as before.
            return false;
          }
        }
        score.set(originalWord, (score.get(originalWord) || 0) + 10);
        word = word.replace(yellowResult.letter, "-");
        return true;
      }
    }

    // must not have any black letters
    for (const blackResult of mappedResults[ResultColor.Black]) {
      if (word.includes(blackResult.letter)) {
        return false;
      } else {
        score.set(originalWord, (score.get(originalWord) || 0) + 1);
        word = word.replace(blackResult.letter, "-");
      }
    }

    return true;
  });

  return newWordList.sort((a, b) => (score.get(a) || 0) - (score.get(b) || 0));
}
