import { log } from "../common/logger";
import { prettyPrintResult } from "../common/prettyPrintResult";
import { getFilteredWordList } from "./filter";

const result = [
  { index: 0, letter: "s", color: 1 },
  { color: 2, letter: "p", index: 1 },
  { index: 2, letter: "e", color: 1 },
  { color: 0, letter: "n", index: 3 },
  { color: 0, letter: "d", index: 4 },
];

const words = ["spend", "spell", "shell", "smell", "speck", "swell"];

const filteredList = getFilteredWordList(words, result);

prettyPrintResult("swell".toUpperCase(), []);

for (const word of filteredList) {
  prettyPrintResult(word, result);
}

log(filteredList);
