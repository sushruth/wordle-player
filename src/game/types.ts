export type Word = string;
export type Letter = string;

export const enum ResultColor {
  Black,
  Green,
  Yellow,
}

export type LetterResult = {
  letter: Letter;
  index: number;
  color: ResultColor;
};

export type WordResult = LetterResult[];
