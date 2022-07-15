const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
export const prompt = (query: string) =>
  new Promise<string>((resolve) => rl.question(query, resolve));
