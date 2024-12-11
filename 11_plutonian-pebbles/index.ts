import { isEven } from "../utils/number.ts";

export const solve = (input: string, maxAmountBlinks: number = 25) => {
  let count = 0;

  input.split(" ").forEach((stoneLabel) => {
    const value = Number(stoneLabel);
    count += blink(value, maxAmountBlinks);
  });

  return count;
};

const mem: Record<string, number> = {};

/**
 * Return amount of leaves in the tree
 * @param value
 * @param maxAmountBlinks
 * @param previousAmountBlinks
 * @returns
 */
const blink = (
  value: number,
  maxAmountBlinks: number,
  previousAmountBlinks: number = 0
): number => {
  const memKey = `${value}-${maxAmountBlinks - previousAmountBlinks}`;
  if (mem[memKey]) {
    return mem[memKey];
  }

  if (previousAmountBlinks === maxAmountBlinks) {
    return 1;
  }

  if (value === 0) {
    const res = blink(1, maxAmountBlinks, previousAmountBlinks + 1);
    mem[memKey] = res;
    return res;
  }

  const digitAsString = String(value);
  if (isEven(digitAsString.length)) {
    const halfway = digitAsString.length / 2;
    const [leftStr, rightStr] = [
      digitAsString.slice(0, halfway),
      digitAsString.slice(halfway),
    ];

    const resLeft = blink(
      Number(leftStr),
      maxAmountBlinks,
      previousAmountBlinks + 1
    );
    const resRight = blink(
      Number(rightStr),
      maxAmountBlinks,
      previousAmountBlinks + 1
    );

    mem[memKey] = resLeft + resRight;
    return resLeft + resRight;
  }

  const res = blink(value * 2024, maxAmountBlinks, previousAmountBlinks + 1);
  mem[memKey] = res;
  return res;
};
