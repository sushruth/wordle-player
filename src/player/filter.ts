import { LetterResult, ResultColor, Word, WordResult } from "../game/types";

function replaceAt(word: Word, index: number) {
  return word.substring(0, index) + "-" + word.substring(index + 1);
}

export function getFilteredWordList(wordList: Word[], lastResult: WordResult) {
  const mappedResults: Record<ResultColor, LetterResult[]> = {
    [ResultColor.Black]: [],
    [ResultColor.Green]: [],
    [ResultColor.Yellow]: [],
  };

  let lastWord = "";

  for (const result of lastResult) {
    lastWord += result.letter;
    mappedResults[result.color].push(result);
  }

  const newWordList = wordList.filter((originalWord) => {
    let word = originalWord.slice();
    // always remove last word
    if (word === lastWord) return false;

    // must have all green letters
    for (const greenResult of mappedResults[ResultColor.Green]) {
      if (word[greenResult.index] !== greenResult.letter) {
        return false;
      } else {
        word = replaceAt(word, greenResult.index);
      }
    }

    // must have all yellow letters excluding green ones, in different indices than result has
    for (const yellowResult of mappedResults[ResultColor.Yellow]) {
      if (!word.includes(yellowResult.letter)) {
        return false;
      } else {
        if (word[yellowResult.index] === yellowResult.letter) {
          return false;
        } else {
          word = word.replace(yellowResult.letter, "-");
        }
      }
    }

    // must not have any black letters
    for (const blackResult of mappedResults[ResultColor.Black]) {
      if (word.includes(blackResult.letter)) {
        return false;
      } else {
        word = word.replace(blackResult.letter, "-");
      }
    }

    return true;
  });

  return newWordList;
}
