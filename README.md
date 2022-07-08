# wordle-exercise

This repo has code that when run, plays the **wordle** game by itself based on a 2300+ word list.

## How to run

Install -

1. NodeJS LTS
2. `yarn`

Then run the following commands:

```sh
git clone git@github.com:sushruth/wordle-player.git
cd wordle-player
yarn
yarn esr ./src/player/guess.ts
```

## How does it look?

![demo](./docs/demo.png)

## Some stats about how (in)efficient this is

```json
{
  "maxAttempts": 13, // game with max attempts
  "minAttempts": 2, // game with min attempts
  "averageAttemptsList": 5.899999999999877, // average attempts per game
  "totalGamesPlayed": 1000 // total games played
}
```

## Issues

### The Yellow issue

Does not fully eliminate yellow tile reuse

![](./docs/problem_yellow.png)

### Not statistically sound yet -

It can take a while to solve sometimes

![](docs/problem_long.png)
