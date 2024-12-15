import {
  addDirectionToCoordinate,
  Board,
  Coordinate,
  destringifyCoord,
  Direction,
  stringifyCoord,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";

const Encoding = {
  WALL: "#",
  OPEN: ".",
  ROBOT: "@",
  BOX: "O",
  WIDE_BOX_LEFT: "[",
  WIDE_BOX_RIGHT: "]",
};

const moveToDirection = {
  "^": Direction.N,
  v: Direction.S,
  ">": Direction.E,
  "<": Direction.W,
};

const checkShiftingBoxes = (
  currentPosition: Coordinate,
  direction: Direction,
  board: Board<string, number>,
  boxesToShift: Coordinate[]
) => {
  // If there is a wall in the sequence, we can't shift any boxes
  if (board.getCell(currentPosition) === Encoding.WALL) {
    return [];
  }
  if (board.getCell(currentPosition) === Encoding.OPEN) {
    return boxesToShift;
  }

  if (board.getCell(currentPosition) === Encoding.ROBOT) {
    return checkShiftingBoxes(
      addDirectionToCoordinate(currentPosition, direction),
      direction,
      board,
      boxesToShift
    );
  }

  // At this point the current position can only be a box
  const nextPosition = addDirectionToCoordinate(currentPosition, direction);

  return checkShiftingBoxes(nextPosition, direction, board, [
    ...boxesToShift,
    currentPosition,
  ]);
};

const swapCell = (
  board: Board<string, number>,
  from: Coordinate,
  to: Coordinate
) => {
  const fromValue = board.getCell(from)!;
  const toValue = board.getCell(to)!;
  board.setCell(fromValue, to);
  board.setCell(toValue, from);
};

export const solvePart1 = (input: string) => {
  const [boardRaw, instructionsRaw] = input.split("\n\n");
  const board = Board.fromUnparsedBoard(boardRaw);
  let instructions = instructionsRaw.replaceAll(/\s/g, "");

  let currentPosition = board.getPositionsByKey(Encoding.ROBOT)[0];
  while (instructions.length > 0) {
    const currentMove =
      moveToDirection[instructions[0] as keyof typeof moveToDirection];

    const boxesToShift = checkShiftingBoxes(
      currentPosition,
      currentMove,
      board,
      []
    );

    const boxesToShiftRev = boxesToShift.reverse();

    // Need to start from the back
    for (const boxToShift of boxesToShiftRev) {
      swapCell(
        board,
        boxToShift,
        addDirectionToCoordinate(boxToShift, currentMove)
      );
    }

    // Finish up loop
    // Need a safety check if cell ahead is an empty space
    const aheadPosition = addDirectionToCoordinate(
      currentPosition,
      currentMove
    );

    if (board.getCell(aheadPosition) === Encoding.OPEN) {
      swapCell(
        board,
        currentPosition,
        addDirectionToCoordinate(currentPosition, currentMove)
      );
      currentPosition = addDirectionToCoordinate(currentPosition, currentMove);
    }

    instructions = instructions.slice(1);
  }

  return board.getPositionsByKey(Encoding.BOX).reduce((acc, boxPosition) => {
    return acc + 100 * boxPosition.row + boxPosition.col;
  }, 0);
};

/**
 * Recursive function to check which boxes to shift in the given direction.
 * @param currentPosition
 * @param direction
 * @param board
 * @param boxesToShift
 * @param fromConnection True when the current position is invoked from the other half of the box. So we don't invoke the other half, which would cause an infinite loop.
 * @returns
 */
const checkShiftingBoxes2 = (
  currentPosition: Coordinate,
  direction: Direction,
  board: Board<string, number>,
  boxesToShift: HashSet<Coordinate>,
  fromConnection: boolean = false
): {
  abort: boolean;
  boxesToShift?: HashSet<Coordinate>;
} => {
  // If there is a wall in the sequence, we can't shift any boxes
  if (board.getCell(currentPosition) === Encoding.WALL) {
    return { abort: true };
  }

  if (board.getCell(currentPosition) === Encoding.OPEN) {
    return { abort: false, boxesToShift };
  }

  if (board.getCell(currentPosition) === Encoding.ROBOT) {
    return checkShiftingBoxes2(
      addDirectionToCoordinate(currentPosition, direction),
      direction,
      board,
      boxesToShift
    );
  }

  // At this point the current position can only be a box

  // If we are pushing from the east or west, we can consider
  // this a simple row and just skip ahead 2 positions to check
  if (direction === Direction.E || direction === Direction.W) {
    const nextPosition = addDirectionToCoordinate(currentPosition, direction);

    return checkShiftingBoxes2(
      nextPosition,
      direction,
      board,
      boxesToShift.include(currentPosition)
    );
  }

  // We are pushing from the north or south from here onwards
  const nextPosition = addDirectionToCoordinate(currentPosition, direction);

  if (board.getCell(currentPosition) === Encoding.WIDE_BOX_LEFT) {
    const left = checkShiftingBoxes2(
      nextPosition,
      direction,
      board,
      boxesToShift.include(currentPosition)
    );
    const right = fromConnection
      ? { abort: false, boxesToShift: new HashSet((x) => String(x)) }
      : checkShiftingBoxes2(
          addDirectionToCoordinate(currentPosition, Direction.E),
          direction,
          board,
          boxesToShift.include(currentPosition),
          true
        );

    if (left.abort || right.abort) return { abort: true };

    return {
      abort: false,
      boxesToShift: left.boxesToShift!.unionX(right.boxesToShift!),
    };
  }

  const right = checkShiftingBoxes2(
    nextPosition,
    direction,
    board,
    boxesToShift.include(currentPosition)
  );
  const left = fromConnection
    ? { abort: false, boxesToShift: new HashSet((x) => String(x)) }
    : checkShiftingBoxes2(
        addDirectionToCoordinate(currentPosition, Direction.W),
        direction,
        board,
        boxesToShift.include(currentPosition),
        true
      );

  if (left.abort || right.abort) return { abort: true };

  return {
    abort: false,
    boxesToShift: left.boxesToShift!.unionX(right.boxesToShift!),
  };
};

export const solvePart2 = (input: string) => {
  const [boardRaw, instructionsRaw] = input.split("\n\n");

  let newBoard = "";
  for (const char of boardRaw) {
    if (char === "\n") {
      newBoard += "\n";
    }

    if (char === Encoding.ROBOT) {
      newBoard += Encoding.ROBOT + Encoding.OPEN;
    }

    if (char === Encoding.BOX) {
      newBoard += Encoding.WIDE_BOX_LEFT + Encoding.WIDE_BOX_RIGHT;
    }

    if (char === Encoding.WALL) {
      newBoard += Encoding.WALL + Encoding.WALL;
    }

    if (char === Encoding.OPEN) {
      newBoard += Encoding.OPEN + Encoding.OPEN;
    }
  }

  const board = Board.fromUnparsedBoard(newBoard);

  let instructions = instructionsRaw.replaceAll(/\s/g, "");

  let currentPosition = board.getPositionsByKey(Encoding.ROBOT)[0];
  while (instructions.length > 0) {
    const currentMove =
      moveToDirection[instructions[0] as keyof typeof moveToDirection];

    const boxesToShift = checkShiftingBoxes2(
      currentPosition,
      currentMove,
      board,
      new HashSet(stringifyCoord)
    );

    // Need to sort by direction
    // string -> coord
    const boxesToShiftRev =
      boxesToShift.boxesToShift
        ?.list()
        ?.map((x) => destringifyCoord(x))
        ?.sort((a, b) => {
          if (currentMove === Direction.N) {
            return a.row - b.row;
          }
          if (currentMove === Direction.S) {
            return b.row - a.row;
          }
          if (currentMove === Direction.E) {
            return b.col - a.col;
          }
          if (currentMove === Direction.W) {
            return a.col - b.col;
          }

          return 1;
        }) || [];

    // Need to start from the back
    for (const boxToShift of boxesToShiftRev) {
      swapCell(
        board,
        boxToShift,
        addDirectionToCoordinate(boxToShift, currentMove)
      );
    }

    // Finish up loop
    // Need a safety check if cell ahead is an empty space
    const aheadPosition = addDirectionToCoordinate(
      currentPosition,
      currentMove
    );

    if (board.getCell(aheadPosition) === Encoding.OPEN) {
      swapCell(
        board,
        currentPosition,
        addDirectionToCoordinate(currentPosition, currentMove)
      );
      currentPosition = addDirectionToCoordinate(currentPosition, currentMove);
    }

    instructions = instructions.slice(1);
  }

  return board
    .getPositionsByKey(Encoding.WIDE_BOX_LEFT)
    .reduce((acc, boxPosition) => {
      return acc + 100 * boxPosition.row + boxPosition.col;
    }, 0);
};
