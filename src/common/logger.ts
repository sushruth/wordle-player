let isSilent = false;

export function silence(value = true) {
  isSilent = value;
}

export const log: typeof console.log = (...args) => {
  if (isSilent) return;
  console.log(...args);
};
