import babar from "babar";
import { program } from "commander";
import { log, silence } from "../common/logger";
import { Word } from "../game/types";
import { words } from "../words";
import { playTheGame } from "./game";

const packageJson = require("../../package.json");

const lostGames: Set<Word> = new Set();

async function playMultipleGames(count = 1, sequential = false) {
  const attemptCountList: number[] = [];

  for (let i = 0; i < count; i++) {
    log(`\n=====================\n`);
    const [attemptCount, guessedWord] = await playTheGame(sequential);
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
};

async function run(options: Options) {
  if (options.debugOptions) {
    console.log(options);
  }

  if (options.silent) {
    silence();
  }

  const attemptCountList = await playMultipleGames(
    options.sequential ? words.length : Number(options.count),
    options.sequential
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

async function main() {
  program
    .name("yarn start")
    .version(packageJson.version)
    .option("-c, --count <number>", "Number of games to play", "1")
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

  await program.parseAsync();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
