import { prettyPrintResult } from "../common/prettyPrintResult";
import { getFilteredWordList } from "./filter";

const result = [
  { color: 0, letter: "s", index: 0 },
  { index: 1, letter: "i", color: 1 },
  { color: 0, letter: "e", index: 2 },
  { color: 0, letter: "g", index: 3 },
  { index: 4, letter: "e", color: 1 },
];

const words = [
  "siege",
  "hinge",
  "pique",
  "singe",
  "niece",
  "since",
  "sieve",
  "pixie",
  "niche",
  "rinse",
  "piece",
];

const filteredList = getFilteredWordList(words, result);

prettyPrintResult("NICHE", []);

for (const word of filteredList) {
  prettyPrintResult(word, result);
}

console.log(filteredList);
