import { prettyPrintResult } from "../common/prettyPrintResult";
// import { words } from "../words";
import { isThisTheWord, startNewGame } from "./evaluator";

startNewGame();

// const word = words[Math.floor(Math.random() * words.length)];
const word = "awake";

const r = isThisTheWord(word);

prettyPrintResult(word, r);
