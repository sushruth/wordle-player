import { prettyPrintResult } from "../common/prettyPrintResult";
// import { words } from "../words";
import { isThisTheWord, setUpANewGame } from "./evaluator";

setUpANewGame();

// const word = words[Math.floor(Math.random() * words.length)];
const word = "steep";

const r = isThisTheWord(word);

prettyPrintResult(word, r);
