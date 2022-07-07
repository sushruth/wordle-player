import { getLetterIndices } from "../common/helpers";
import { Word, Letter } from "../common/types";
import { words } from "../common/words";

export let latestGuess: Word = "";
export let latestGuessMap: Map<Letter, number[]> = new Map();
export let filteredWords = words.slice(0);

export function setFilteredWords(words: Word[]) {
  filteredWords = words;
}

export function getNewRandomFilteredWord() {
  latestGuess = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  latestGuessMap = getLetterIndices(latestGuess);

  return latestGuess;
}

export function guessProbableFilteredWord() {
  
}
