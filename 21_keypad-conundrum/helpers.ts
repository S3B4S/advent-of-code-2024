import {
  Board,
  Characters,
  Coordinate,
  Direction,
  directionArrows3,
  dpadDirections,
  stringifyCoord,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { properlyGrouped } from "../utils/list.ts";

/**
 * For exmaple:
 *  - resolveInstructions(keypadBoard, ["2,0"]) => { "2,0": ["<^AvA", "^<AvA"] }
 *  - resolveInstructions(keypadBoard, ["2,0", "0,2"]) => { "2,0": ["<^AvA", "^<AvA"], "0,2": ["<A^A"] }
 * @param board
 * @param instructions
 */
export const resolveInstructions = <Instruction extends string>(
  board: Board<PropertyKey, number>,
  instructions: Instruction[]
): Record<Instruction, string[]> => {
  const result = {} as Record<Instruction, string[]>;

  for (const instruction of instructions) {
    result[instruction] = recResolveInstr(
      board,
      board.getPositionsByKey("A")[0],
      instruction
    );
  }
  return result;
};

export const recResolveInstr = (
  board: Board<PropertyKey, number>,
  startPosition: Coordinate,
  instructions: string,
  prevPaths: string[] = []
): string[] => {
  if (instructions === "") {
    return prevPaths;
  }

  const nextChar = instructions[0];

  const paths = getButtonPresses(board, startPosition, nextChar);
  const newPosition = board.getPositionsByKey(nextChar)[0];

  // First time we encounter it
  if (prevPaths?.length === 0) {
    return recResolveInstr(board, newPosition, instructions.slice(1), paths);
  }

  // The amount of possibilities we have here, we need to add to _every_ previous path.
  // In other words, if we previously already have 2 paths to get here, and we have 3 new paths to get to next character,
  // We have a total of 6 paths now.
  const newPaths = prevPaths.flatMap((oldPath) => {
    return paths.map((path) => `${oldPath}${path}`);
  });

  return recResolveInstr(board, newPosition, instructions.slice(1), newPaths);
};

/**
 * Resolves to a shortest path of the given instruction
 * @param board
 * @param startPosition
 * @param instructions
 * @param prevPaths
 * @returns
 */
export const resolveToShortestPath = (
  boards: Board<PropertyKey, number>[],
  instruction: string
): string => {
  let depth = boards.length - 1;

  const currentInstructions = {
    [depth]: [instruction],
  };

  for (const board of boards.toReversed()) {
    for (const instruction of currentInstructions[depth]) {
      const result = recResolveInstr(
        board,
        board.getPositionsByKey("A")[0],
        instruction
      );

      currentInstructions[depth - 1] = currentInstructions[depth - 1] ?? [];
      currentInstructions[depth - 1] =
        currentInstructions[depth - 1].concat(result);
    }

    depth--;
  }

  return Object.values(currentInstructions["-1"]).reduce((acc, curr) => {
    return acc.length < curr.length ? acc : curr;
  });
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
  nextChar: string
) => {
  const queue: [Coordinate, string[]][] = [[currentPosition, []]];
  const visited = new HashSet(stringifyCoord);

  const pathCandidates: string[][] = [];

  while (queue.length > 0) {
    const [currentPosition, path] = queue.shift()!;

    visited.include(currentPosition);

    const currentChar = board.getCell(currentPosition);

    if (currentChar === nextChar) {
      pathCandidates.push(path);
    }

    for (const [neighbour, direction] of board.getNeighboursWithDirections(
      currentPosition,
      dpadDirections
    )) {
      if (
        !visited.contains(neighbour) &&
        !queue.some(([coord]) => coord === neighbour) &&
        board.safeGetCell(neighbour) !== Characters.X
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

  const filteredCandidates = [];

  // Remove those that don't move in 1 direction in sequence
  for (const path of pathCandidates) {
    if (properlyGrouped(path)) {
      path.push("A");
      filteredCandidates.push(path);
    }
  }

  return filteredCandidates.map((path) => path.join(""));
};
