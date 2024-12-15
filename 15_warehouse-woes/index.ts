import {
  addDirectionToCoordinate,
  Board,
  Coordinate,
  Direction,
} from "../utils/board.ts";

const Encoding = {
  WALL: "#",
  OPEN: ".",
  ROBOT: "@",
  BOX: "O",
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
    // console.log("-----NEW LOOP----- ", instructions);
    const currentMove =
      moveToDirection[instructions[0] as keyof typeof moveToDirection];

    const boxesToShift = checkShiftingBoxes(
      currentPosition,
      currentMove,
      board,
      []
    );

    const boxesToShiftRev = boxesToShift.reverse();
    // console.log("boxesToShift:", boxesToShift);

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
    // console.log("aheadPosition", aheadPosition);

    if (board.getCell(aheadPosition) === Encoding.OPEN) {
      swapCell(
        board,
        currentPosition,
        addDirectionToCoordinate(currentPosition, currentMove)
      );
      currentPosition = addDirectionToCoordinate(currentPosition, currentMove);
    }

    // console.log(board.toString());
    instructions = instructions.slice(1);
  }

  // console.log(board.getPositionsByKey(Encoding.BOX));
  return board.getPositionsByKey(Encoding.BOX).reduce((acc, boxPosition) => {
    return acc + 100 * boxPosition.row + boxPosition.col;
  }, 0);
};

export const solvePart2 = (input: string) => {
  return 0;
};
