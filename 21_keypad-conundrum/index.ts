import {
  Board,
  Coordinate,
  Direction,
  directionArrows3,
  dpadDirections,
  stringifyCoord,
} from "../utils/board.ts";
import { Characters } from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { zip } from "../utils/list.ts";
import { isOdd } from "../utils/number.ts";

const numericKeypadInput = `
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

const directionalKeypadInput = `
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
`.trim();

// 1 level for the robot that controls numeric keypad
// 2 levels for the robot that controls directional keypad
const DEPTH_ROBOTS = 3;

export const solvePart1 = (input: string) => {
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

  const targets = input.split("\n");

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

  const targetPerDepth: { [key: number]: string } = {
    [DEPTH_ROBOTS - 1]: targets[0],
  };
  // console.log(targetPerDepth);
  // We work from the keypad back up to the robot
  // { DEPTH: [BUTTON_PRESSES] }
  const buttonPresses: { [key: string]: string[] } = {};
  for (let depth = DEPTH_ROBOTS - 1; depth >= 0; depth--) {
    // console.log();
    // console.log("--- DEPTH", depth);
    buttonPresses[depth] = [];

    // console.log(depth === DEPTH_ROBOTS - 1 ? "numericBoard" : "dpadBoard");
    const currentBoard = depth === DEPTH_ROBOTS - 1 ? numericBoard : dpadBoard;

    let currentPosition = currentBoard.getPositionsByKey("A")[0];

    // Build the instructions needed for this depth level
    for (const nextChar of targetPerDepth[depth]) {
      buttonPresses[depth] = buttonPresses[depth].concat(
        getButtonPresses(currentBoard, currentPosition, nextChar, -1)
      );
      currentPosition = currentBoard.getPositionsByKey(nextChar)[0];
    }

    // console.log(buttonPresses);
    targetPerDepth[depth - 1] = buttonPresses[depth].join("");
    // console.log(targetPerDepth);
    // const keypad = depth === 0 ? numericBoard : dpadBoard;
    // const dpad = depth === 1 ? dpadBoard : numericBoard;
  }

  // @BUG Gaps are not being skipped
  const numericPartCode = Number(targetPerDepth[DEPTH_ROBOTS - 1].slice(0, -1));

  return targetPerDepth["-1"].length * numericPartCode;
};

/**
 * Uses BFS to find the shortest path to the next character
 * @param board
 * @param currentPosition
 * @param nextChar
 * @returns
 */
export const getButtonPresses = (
  board: Board<PropertyKey, number>,
  currentPosition: Coordinate,
  nextChar: string,
  debugDepth?: number
) => {
  let buttonPresses: string[] = [];
  const queue: [Coordinate, string[]][] = [[currentPosition, []]];
  const visited = new HashSet(stringifyCoord);

  if (debugDepth === 1) {
    console.log(board.encoding);
    console.log("Entering queue");
  }
  while (queue.length > 0) {
    const [currentPosition, path] = queue.shift()!;

    if (debugDepth === 1) {
      console.log({ currentPosition, path });
    }

    visited.include(currentPosition);

    const currentChar = board.getCell(currentPosition);

    if (currentChar === nextChar) {
      buttonPresses = path;
      break;
    }

    for (const [neighbour, direction] of board.getNeighboursWithDirections(
      currentPosition,
      dpadDirections
    )) {
      if (
        !visited.contains(neighbour) &&
        !queue.some(([coord]) => coord === neighbour)
      ) {
        queue.push([
          neighbour,
          [
            ...path,
            directionArrows3[direction as Direction.N /* and the others */],
          ],
        ]);
      }
    }
  }

  if (debugDepth === 1) {
    console.log("Exiting queue");
    console.log({ currentPosition, nextChar, buttonPresses });
  }

  // console.log({ start: currentPosition, nextChar, buttonPresses });
  buttonPresses.push("A");
  return buttonPresses;
};

export const solvePart2 = (input: string) => {
  return 0;
};
