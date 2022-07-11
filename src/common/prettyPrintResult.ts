import pc from "picocolors";
import { ResultColor, Word, WordResult } from "../game/types";
import { log } from "./logger";

export function prettyPrintResult(
  word: Word,
  result?: WordResult,
  attempt?: number | string
) {
  let text = "";

  if (attempt) {
    text += pc.gray(` ${attempt} `);
  }

  for (let i = 0; i < word.length; i++) {
    const letter = word[i];

    if (result?.[i]) {
      switch (result[i].color) {
        case ResultColor.Black:
          text += pc.bgBlack(pc.white(` ${letter.toUpperCase()} `));
          break;
        case ResultColor.Green:
          text += pc.bgGreen(pc.white(` ${letter.toUpperCase()} `));
          break;
        case ResultColor.Yellow:
          text += pc.bgYellow(pc.white(` ${letter.toUpperCase()} `));
          break;
      }
    } else {
      text += pc.bgBlue(pc.white(` ${letter} `));
    }
  }

  log(text);
}
