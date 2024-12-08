import { BidirectionalMap } from "../utils/bidirectionalMap.ts";
import {
  addCoordinates,
  Coordinate,
  relativeCoords,
  stringifyCoord,
  stringifyCoordDirection,
} from "../utils/board.ts";
import { Direction } from "../utils/board.ts";
import { Board } from "../utils/board.ts";
import { HashMap } from "../utils/hashMap.ts";

const turn90Degrees = (direction: Direction): Direction => {
  return (
    {
      [Direction.N]: Direction.E,
      [Direction.E]: Direction.S,
      [Direction.S]: Direction.W,
      [Direction.W]: Direction.N,

      [Direction.NE]: Direction.N,
      [Direction.NW]: Direction.N,
      [Direction.SE]: Direction.N,
      [Direction.SW]: Direction.N,
    }[direction] || Direction.N
  );
};

const turn90DegreesCounterClockwise = (direction: Direction): Direction => {
  return (
    {
      [Direction.N]: Direction.W,
      [Direction.E]: Direction.N,
      [Direction.S]: Direction.E,
      [Direction.W]: Direction.S,

      [Direction.NE]: Direction.N,
      [Direction.NW]: Direction.N,
      [Direction.SE]: Direction.N,
      [Direction.SW]: Direction.N,
    }[direction] || Direction.N
  );
};

export const coordsBetween = (
  coordA: Coordinate,
  coordB: Coordinate
): Coordinate[] => {
  let result = [];
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

  const board = new Board(
    asString,
    width,
    new BidirectionalMap<string, number>({
      "^": 1,
      "#": 2,
    })
  );

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
      currentDirection = turn90Degrees(currentDirection);
    }
  });

  return Object.keys(hashMapVisited).length;
};

const directionArrows = {
  [Direction.N]: "⬆️",
  [Direction.E]: "➡️",
  [Direction.S]: "⬇️",
  [Direction.W]: "⬅️",
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

  const encoding = new BidirectionalMap<string, number>({
    ".": 0,
    "^": 1,
    "#": 2,
    A: 10,
    ">": 11,
    v: 12,
    "<": 13,
  });

  const board = new Board(asString, width, encoding);

  const hashmapObstacles: Record<string, Coordinate> = {};

  board.iterateOver("#", (coord) => {
    hashmapObstacles[stringifyCoord(coord)] = coord;
  });

  const placedObjectsHashMap = new HashMap<Coordinate>(stringifyCoord);

  board.iterateOver("^", (coord) => {
    let currentDirection = Direction.N;

    const pawn = new Pawn(board, coord);

    for (let i = 0; i < width * height; i++) {
      const hasTakenStep = pawn.conditionalNextStep((peekingAtCoord, value) => {
        board.setCell(
          directionNums[currentDirection as keyof typeof directionNums],
          pawn.currentPosition
        );

        if (value === ".") {
          const newBoard = new Board(asString, width, encoding);
          newBoard.setCell(2, peekingAtCoord);
          const ghost = new Pawn(newBoard, pawn.currentPosition);
          const hasLoop = detectLoop(ghost, turn90Degrees(currentDirection));

          if (hasLoop) placedObjectsHashMap.add(peekingAtCoord);

          return currentDirection;
        }
        if (value === "#") {
          currentDirection = turn90Degrees(currentDirection);
          return currentDirection;
        }
        return currentDirection;
      }, currentDirection);
      if (!hasTakenStep) break;
    }
  });

  return placedObjectsHashMap.size();
};

const detectLoop = (pawn: Pawn, direction: Direction) => {
  // Bug: the actual inserted object is not present here so it could miss on loops
  const visitedHashMap = new HashMap<{ coord: Coordinate; dir: Direction }>(
    ({ coord, dir }) => stringifyCoordDirection(coord, dir)
  );

  let currentDirection = direction;
  for (let i = 0; i < 130 * 130; i++) {
    if (
      visitedHashMap.has({ coord: pawn.currentPosition, dir: currentDirection })
    ) {
      // If we've been here before, break
      return true;
    }

    visitedHashMap.add({ coord: pawn.currentPosition, dir: currentDirection });

    const hasTakenStep = pawn.conditionalNextStep((coord, value) => {
      if (value === ".") {
        return currentDirection;
      }
      if (value === "#") {
        currentDirection = turn90Degrees(currentDirection);
        return currentDirection;
      }
      return currentDirection;
    }, currentDirection);

    if (!hasTakenStep) break;
  }

  return false;
};

/**
 * A pawn is something you can place on a board and move around
 */
class Pawn {
  private _board: Board<PropertyKey, number>;
  currentPosition: Coordinate;

  constructor(board: Board<PropertyKey, number>, startingPosition: Coordinate) {
    this._board = board;
    this.currentPosition = startingPosition;
  }

  step(direction: Direction, n: number = 1) {
    for (let i = 0; i < n; i++) {
      this.currentPosition = addCoordinates(
        this.currentPosition,
        relativeCoords[direction]
      );
    }
  }

  /**
   * Peek ahead and based on the value of the upcoming tile, you can change directions
   * @param callback coord is the next position the pawn goes to
   * @param direction
   * @param n
   * @returns true if a step was taken, false if not (due to out of bounds for example)
   */
  conditionalNextStep(
    callback: (coord: Coordinate, value: PropertyKey) => Direction,
    direction: Direction,
    n: number = 1
  ) {
    const peekNextStep = this.peekStep(direction, n);
    if (!this._board.isWithinBounds(peekNextStep)) return false;
    const nextDirection = callback(
      peekNextStep,
      this._board.getCell(peekNextStep)!
    );
    // Only move if we still go the same direciton.
    // If direction has changed, first only turn around
    if (direction === nextDirection) {
      this.step(nextDirection, n);
    }
    // Turning around is also a "step"
    return true;
  }

  /**
   *
   * @param direction
   * @param n
   */
  peekStep(direction: Direction, n: number = 1) {
    let result = this.currentPosition;
    for (let i = 0; i < n; i++) {
      result = addCoordinates(result, relativeCoords[direction]);
    }
    return result;
  }
}
