const LOWER_LIMIT = 1;
const UPPER_LIMIT = 3;

const isSafe = (list: number[]) => {
  if (list[1] === list[0]) return false;

  const isAscending = list[1] - list[0] > 0;

  let curr = list[0];

  for (let i = 1; i < list.length; i++) {
    const next = list[i];
    const diff = Math.abs(next - curr);
    const isWithinBounds = diff >= LOWER_LIMIT && diff <= UPPER_LIMIT;

    if (!isWithinBounds) {
      return false;
    }

    if (isAscending && next > curr && isWithinBounds) {
      curr = next;
      continue;
    }

    if (!isAscending && next < curr && isWithinBounds) {
      curr = next;
      continue;
    }

    return false;
  }

  return true;
};

export const solvePart1 = (input: string) => {
  const inputLines = input
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map((x) => Number(x)));

  return inputLines.map(isSafe).filter((x) => x).length;
};

const isSafeB = (list: number[], tryAgainFlag: boolean = false) => {
  if (list[1] === list[0]) {
    if (tryAgainFlag) {
      return tryAgain(list);
    }
    return false;
  }

  const isAscending = list[1] - list[0] > 0;

  let curr = list[0];

  for (let i = 1; i < list.length; i++) {
    const next = list[i];
    const diff = Math.abs(next - curr);
    const isWithinBounds = diff >= LOWER_LIMIT && diff <= UPPER_LIMIT;

    if (!isWithinBounds) {
      if (tryAgainFlag) {
        return tryAgain(list);
      }
      return false;
    }

    if (isAscending && next > curr && isWithinBounds) {
      curr = next;
      continue;
    }

    if (!isAscending && next < curr && isWithinBounds) {
      curr = next;
      continue;
    }

    if (tryAgainFlag) {
      return tryAgain(list);
    }
    return false;
  }

  return true;
};

const tryAgain = (list: number[]) => {
  for (let i = 0; i < list.length; i++) {
    const newList = [...list];
    newList.splice(i, 1);
    if (isSafeB(newList)) {
      return true;
    }
  }
  return false;
};

export const solvePart2 = (input: string) => {
  const inputLines = input
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map((x) => Number(x)));

  return inputLines.map((line) => isSafeB(line, true)).filter((x) => x).length;
};
