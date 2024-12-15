import { BijectiveMap } from "../utils/bijectiveMap.ts";
import {
  Coordinate,
  stringifyCoord,
  stringifyCoordDirection,
  turn90DegreesClockWise,
} from "../utils/board.ts";
import { Direction } from "../utils/board.ts";
import { Board } from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { Pawn } from "../utils/pawn.ts";

export const coordsBetween = (
  coordA: Coordinate,
  coordB: Coordinate
): Coordinate[] => {
  const result = [];
  if (coordA.row === coordB.row) {
    const [min, max] =
      coordA.col < coordB.col ? [coordA, coordB] : [coordB, coordA];
    for (let i = min.col + 1; i < max.col; i++) {
      result.push({ row: min.row, col: i });
    }
  }

  if (coordA.col === coordB.col) {
    const [min, max] =
      coordA.row < coordB.row ? [coordA, coordB] : [coordB, coordA];
    for (let i = min.row + 1; i < max.row; i++) {
      result.push({ row: i, col: min.col });
    }
  }

  return result;
};

/**
 * Might want to test
 * @param startingPoint
 * @param direction
 * @param hashmapCols
 * @param hashmapRows
 * @returns
 */
const willFace = (
  startingPoint: Coordinate,
  direction: Direction,
  hashmapColsSorted: Record<number, Coordinate[]>,
  hashmapRowsSorted: Record<number, Coordinate[]>
): Coordinate | undefined => {
  if (direction === Direction.N) {
    const obstaclesInColumn = hashmapColsSorted[startingPoint.col];
    if (!obstaclesInColumn) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    let curr = undefined;
    for (const obstacle of obstaclesInColumn) {
      if (obstacle.row > startingPoint.row) {
        break;
      }
      curr = obstacle;
    }

    return curr;
  }

  if (direction === Direction.S) {
    const obstaclesInColumn = hashmapColsSorted[startingPoint.col];
    if (!obstaclesInColumn) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    for (const obstacle of obstaclesInColumn) {
      if (obstacle.row > startingPoint.row) {
        return obstacle;
      }
    }

    return undefined;
  }

  if (direction === Direction.E) {
    const obstaclesInRow = hashmapRowsSorted[startingPoint.row];
    if (!obstaclesInRow) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    for (const obstacle of obstaclesInRow) {
      if (obstacle.col > startingPoint.col) {
        return obstacle;
      }
    }

    return undefined;
  }

  if (direction === Direction.W) {
    const obstaclesInRow = hashmapRowsSorted[startingPoint.row];
    if (!obstaclesInRow) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    let curr = undefined;
    for (const obstacle of obstaclesInRow) {
      if (obstacle.col > startingPoint.col) {
        break;
      }
      curr = obstacle;
    }

    return curr;
  }
};

export const solvePart1 = (input: string) => {
  const lines = input.trim().split("\n");
  const height = lines.length;
  const width = lines[0].length;

  const asString = input.replaceAll("\n", "");

  const board = new Board(asString, width, height);

  const hashmapColsSorted: Record<number, Coordinate[]> = {};
  const hashmapRowsSorted: Record<number, Coordinate[]> = {};

  board.iterateOver("#", (coord) => {
    if (!hashmapColsSorted[coord.col]) hashmapColsSorted[coord.col] = [];
    hashmapColsSorted[coord.col].push(coord);

    if (!hashmapRowsSorted[coord.row]) hashmapRowsSorted[coord.row] = [];
    hashmapRowsSorted[coord.row].push(coord);
  });

  for (const keyC of Object.keys(hashmapColsSorted)) {
    hashmapColsSorted[Number(keyC)].sort((a, b) => a.row - b.row);
  }

  for (const keyC of Object.keys(hashmapRowsSorted)) {
    hashmapRowsSorted[Number(keyC)].sort((a, b) => a.col - b.col);
  }

  const hashMapVisited: Record<string, Coordinate> = {};

  board.iterateOver("^", (coord) => {
    let currentPosition = { ...coord };
    let currentDirection = Direction.N;

    hashMapVisited[stringifyCoord(currentPosition)] = currentPosition;

    while (true) {
      const nextObject = willFace(
        currentPosition,
        currentDirection,
        hashmapColsSorted,
        hashmapRowsSorted
      );

      if (!nextObject) {
        // If we're gonna leave the map, just need to find the last positions explicitly

        if (Direction.N === currentDirection) {
          for (
            let currentRow = currentPosition.row;
            currentRow >= 0;
            currentRow--
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentRow, col: currentPosition.col })
            ] = { row: currentRow, col: currentPosition.col };
          }
        }
        if (Direction.S === currentDirection) {
          for (
            let currentRow = currentPosition.row;
            currentRow < height;
            currentRow++
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentRow, col: currentPosition.col })
            ] = { row: currentRow, col: currentPosition.col };
          }
        }
        if (Direction.E === currentDirection) {
          for (
            let currentCol = currentPosition.col;
            currentCol < width;
            currentCol++
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentPosition.row, col: currentCol })
            ] = { row: currentPosition.row, col: currentCol };
          }
        }
        if (Direction.W === currentDirection) {
          for (
            let currentCol = currentPosition.col;
            currentCol >= 0;
            currentCol--
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentPosition.row, col: currentCol })
            ] = { row: currentPosition.row, col: currentCol };
          }
        }

        return;
      }

      const inBetweens = coordsBetween(currentPosition, nextObject);
      for (const inBetween of inBetweens) {
        hashMapVisited[stringifyCoord(inBetween)] = inBetween;
      }

      // There must always be some space in between
      if (Direction.N === currentDirection) {
        currentPosition = { col: nextObject.col, row: nextObject.row + 1 };
      } else if (Direction.E === currentDirection) {
        currentPosition = { col: nextObject.col - 1, row: nextObject.row };
      } else if (Direction.S === currentDirection) {
        currentPosition = { col: nextObject.col, row: nextObject.row - 1 };
      } else if (Direction.W === currentDirection) {
        currentPosition = { col: nextObject.col + 1, row: nextObject.row };
      }
      currentDirection = turn90DegreesClockWise(currentDirection);
    }
  });

  return Object.keys(hashMapVisited).length;
};

const directionNums = {
  [Direction.N]: 10,
  [Direction.E]: 11,
  [Direction.S]: 12,
  [Direction.W]: 13,
};

export const solvePart2 = (input: string) => {
  const lines = input.trim().split("\n");
  const height = lines.length;
  const width = lines[0].length;

  const asString = input.replaceAll("\n", "");

  const encoding = new BijectiveMap<string, number>({
    ".": 0,
    "^": 1,
    "#": 2,
    A: 10,
    ">": 11,
    v: 12,
    "<": 13,
  });

  const board = new Board(asString, width, height);

  const placedObjectsHashMap = new HashSet<Coordinate>(stringifyCoord);

  board.iterateOver("^", (startingCoord) => {
    board.setCell(".", startingCoord);
    let currentDirection = Direction.N;

    const pawn = new Pawn<undefined>(board, startingCoord);

    for (let i = 0; i < width * height; i++) {
      const hasTakenAction = pawn.conditionalNextStep(
        (predictedStep, value) => {
          // Below is necessary to get the right answer, but not sure why
          // Ideally I'd like to remove it
          // @TODO
          board.setCell(
            encoding.getX(
              directionNums[currentDirection as keyof typeof directionNums]
            )!,
            pawn.currentPosition
          );

          if (value === ".") {
            const newBoard = new Board(asString, width, height);
            newBoard.setCell("#", predictedStep);
            newBoard.setCell(".", startingCoord);
            const ghost = new Pawn<undefined>(newBoard, pawn.currentPosition);
            const hasLoop = detectLoop(
              ghost,
              turn90DegreesClockWise(currentDirection)
            );

            if (hasLoop) placedObjectsHashMap.include(predictedStep);

            return currentDirection;
          }
          if (value === "#") {
            currentDirection = turn90DegreesClockWise(currentDirection);
            return currentDirection;
          }
          return currentDirection;
        },
        currentDirection
      );
      // If it hasn't taken action, we're about to leave the board
      if (!hasTakenAction) break;
    }
  });

  return placedObjectsHashMap.size;
};

const detectLoop = (pawn: Pawn<undefined>, direction: Direction) => {
  const visited = new HashSet<{ coord: Coordinate; dir: Direction }>(
    ({ coord, dir }) => stringifyCoordDirection(coord, dir)
  );

  let currentDirection = direction;
  for (let i = 0; i < 130 * 130; i++) {
    if (
      visited.contains({
        coord: pawn.currentPosition,
        dir: currentDirection,
      })
    ) {
      return true;
    }

    visited.include({
      coord: pawn.currentPosition,
      dir: currentDirection,
    });

    const hasTakenStep = pawn.conditionalNextStep((_, value) => {
      if (value === ".") {
        return currentDirection;
      }
      if (value === "#") {
        currentDirection = turn90DegreesClockWise(currentDirection);
        return currentDirection;
      }
      return currentDirection;
    }, currentDirection);

    if (!hasTakenStep) break;
  }

  return false;
};
