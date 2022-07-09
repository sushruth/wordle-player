import { program } from "commander";
import { log, silence } from "../common/logger";
import { playTheGame } from "./game";

const packageJson = require("../../package.json");

function playMultipleGames(count = 1) {
  const attemptCountList: number[] = [];

  for (let i = 0; i < count; i++) {
    log(`\n===============\n`);
    attemptCountList.push(playTheGame());
  }

  return attemptCountList;
}

program
  .name("wordle-player")
  .version(packageJson.version)
  .option("-c, --count <number>", "Number of games to play", "1")
  .option("-p, --print-stats", "Print stats about all the plays", false)
  .option("-s, --silent", "silent", false)
  .option("-do, --debug-options", "debug the CLI options", false)
  .action((options) => {
    if (options.debugOptions) {
      console.log(options);
    }

    if (options.silent) {
      silence();
    }

    const attemptCountList = playMultipleGames(Number(options.count));

    if (options.printStats) {
      log(`\n===============\n`);

      const sortedAttemptsList = attemptCountList.sort((a, b) => b - a);
      const maxAttempts = sortedAttemptsList[0];
      const minAttempts = sortedAttemptsList[sortedAttemptsList.length - 1];
      const averageAttemptsList = attemptCountList.reduce(
        (acc, v) => acc + v / attemptCountList.length,
        0
      );

      console.table({
        maxAttempts,
        minAttempts,
        averageAttemptsList,
        totalGamesPlayed: attemptCountList.length,
      });
    }
  })
  .parse();
