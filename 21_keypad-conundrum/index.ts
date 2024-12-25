import { Board } from "../utils/board.ts";
import { Characters } from "../utils/board.ts";
import { isOdd } from "../utils/number.ts";
import { resolveToShortestPath } from "./helpers.ts";

export const numericKeypadInput = `
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+
`.trim();

export const directionalKeypadInput = `
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
`.trim();

export const solve = (input: string, amountOfRobots: number) => {
  const keypad = numericKeypadInput
    .split("\n")
    .filter((_, idx) => isOdd(idx))
    .map((line) => {
      const chars = line
        .slice(2)
        .slice(0, -2)
        .split(" | ")
        .map((char) => (char === Characters.Space ? Characters.X : char));
      return chars;
    });

  const directionalKeypad = directionalKeypadInput
    .split("\n")
    .filter((_, idx) => isOdd(idx))
    .map((line) =>
      line
        .slice(2)
        .slice(0, -2)
        .split(" | ")
        .map((char) => (char === Characters.Space ? Characters.X : char))
    );

  const targets = input.trim().split("\n");

  const numericBoard = new Board(
    keypad.flat(1),
    keypad[0].length,
    keypad.length
  );

  const dpadBoard = new Board(
    directionalKeypad.flat(1),
    directionalKeypad[0].length,
    directionalKeypad.length
  );

  const resolved = targets.map((target) => {
    return resolveToShortestPath(
      Array.from({ length: amountOfRobots }, () => dpadBoard).concat(
        numericBoard
      ),
      target
    );
  });

  return resolved.reduce(
    (sum, shortestPath, idx) =>
      sum + shortestPath.length * Number(targets[idx].slice(0, -1)),
    0
  );
};
