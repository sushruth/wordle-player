import babar from "babar";
import { Option, program } from "commander";
import { getNextItem } from "../common/getNextItem";
import { getRandomItem } from "../common/getRandomItem";
import { log, silence } from "../common/logger";
import { setUpANewGame } from "../game/evaluator";
import { Word } from "../game/types";
import { words } from "../words";
import { playTheGame } from "./single-game";
import { playForWordle } from "./single-game-online";
import { playSingleRound } from "./single-round";

const packageJson = require("../../package.json");

const lostGames: Set<Word> = new Set();

function getGoalWord(sequential = false) {
  return sequential ? getNextItem(words) : getRandomItem(words);
}

async function playMultipleGames(
  sequential = false,
  count = words.length,
  gameFn: typeof playTheGame,
  customGoalWord?: Word
) {
  const attemptCountList: number[] = [];

  for (let i = 0; i < count; i++) {
    log(`\n---------------------\n`);

    let goalWord = customGoalWord || getGoalWord(sequential);

    setUpANewGame(goalWord);

    const [attemptCount, guessedWord] = await gameFn();

    if (attemptCount > 6) {
      lostGames.add(guessedWord);
    }

    attemptCountList.push(attemptCount);
  }

  return attemptCountList;
}

type Options = {
  debugOptions: boolean;
  sequential: boolean;
  silent: boolean;
  count: string;
  printStats: boolean;
  word: string;
};

async function run(options: Options) {
  if (options.debugOptions) {
    console.log(options);
  }

  if (options.silent) {
    silence();
  }

  if (options.word && !words.includes(options.word)) {
    throw Error(
      `The word ${options.word} was not found in the dictionary. I wont be able to play for it.`
    );
  }

  const attemptCountList = await playMultipleGames(
    options.sequential,
    Number(options.count),
    playTheGame,
    options.word
  );

  if (options.printStats) {
    log(`\n===============\n`);

    let lostCount = 0;
    const counts = attemptCountList.reduce(
      (acc, attempts) => {
        if (attempts > 6) {
          lostCount++;
        }
        acc[attempts] = (acc[attempts] || 0) + 1;
        return acc;
      },
      [0, 0, 0] as number[]
    );

    console.log(babar(Array.from(counts.entries())));

    const sortedAttemptsList = attemptCountList.sort((a, b) => b - a);
    const maxAttempts = sortedAttemptsList[0];
    const minAttempts = sortedAttemptsList[sortedAttemptsList.length - 1];
    const averageAttemptsPerGame = attemptCountList.reduce(
      (acc, v) => acc + v / attemptCountList.length,
      0
    );

    console.table({
      maxAttempts,
      minAttempts,
      averageAttemptsPerGame,
      totalGamesPlayed: attemptCountList.length,
      lostCount,
    });

    if (lostGames.size) {
      console.log("Game was lost for these words - \n", [...lostGames].join());
    }
  }
}

async function playOnline() {
  await playForWordle();
}

async function main() {
  program
    .name("yarn start")
    .version(packageJson.version)
    .option("-c, --count <number>", "Number of games to play", "1")
    .option("-w, --word <word>", "Play with a specific goal word")
    .option("-p, --print-stats", "Print stats about all the plays", false)
    .option(
      "-s, --silent",
      "does not print each game in the console when set to true",
      false
    )
    .option(
      "-sq, --sequential",
      "runs through all words in the db sequentially once each",
      false
    )
    .option("-do, --debug-options", "debug the CLI options", false)
    .action(run);

  program
    .command("wordle")
    .description("Play for wordle online")
    .action(playOnline);

  await program.parseAsync();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
