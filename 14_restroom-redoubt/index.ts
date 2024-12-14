import {
  addCoordinates,
  Board,
  Coordinate,
  Direction,
} from "../utils/board.ts";
import { Pawn } from "../utils/pawn.ts";

const Spaces = {
  OPEN: ".",
  WALL: "X",
};

const REGEX = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

/**
 * Assign a pawn to a quadrant based on its position
 * @param coord - The coordinate of the pawn
 * @param width - The width of the board, must be uneven
 * @param height - The height of the board, must be uneven
 * @returns The quadrant number, 0: top left, 1: top right, 2: bottom left, 3: bottom right
 */
const assignToQuadrant = (
  coord: Coordinate,
  width: number,
  height: number
): "top-left" | "top-right" | "bottom-left" | "bottom-right" | "none" => {
  if (width % 2 === 0 || height % 2 === 0) {
    throw new Error("Width and height must be uneven");
  }

  // Middle row and column
  const middleRow = (height - 1) / 2;
  const middleCol = (width - 1) / 2;

  if (coord.col === middleCol || coord.row === middleRow) {
    return "none";
  }

  if (coord.col < middleCol && coord.row < middleRow) {
    return "top-left";
  }

  if (coord.col > middleCol && coord.row < middleRow) {
    return "top-right";
  }

  if (coord.col < middleCol && coord.row > middleRow) {
    return "bottom-left";
  }

  return "bottom-right";
};

export const solvePart1 = (
  input: string,
  {
    nSeconds,
    width,
    height,
  }: {
    nSeconds: number;
    width: number;
    height: number;
  } = {
    // Puzzle parameters
    nSeconds: 100,
    width: 101,
    height: 103,
  }
) => {
  const board = new Board(Spaces.OPEN.repeat(width * height), width, height);

  const pawns = [];

  for (const line of input.trim().split("\n")) {
    const match = line.match(REGEX)!;
    const [px, py, vx, vy] = match?.slice(1, 5).map((x) => Number(x));

    pawns.push(
      new Pawn<{ vx: number; vy: number }>(
        board,
        { col: px, row: py },
        Direction.N,
        {
          vx,
          vy,
        }
      )
    );
  }

  let countPerQuadrant = {
    "top-left": 0,
    "top-right": 0,
    "bottom-left": 0,
    "bottom-right": 0,
  };

  pawns.forEach((pawn) => {
    for (let i = 0; i < nSeconds; i++) {
      const { vx, vy } = pawn.context!;

      const nextPosition = addCoordinates(pawn.currentPosition, {
        col: vx,
        row: vy,
      });

      if (nextPosition.col < 0) {
        nextPosition.col = width + nextPosition.col;
      } else if (nextPosition.col >= width) {
        nextPosition.col = nextPosition.col - width;
      }

      if (nextPosition.row < 0) {
        nextPosition.row = height + nextPosition.row;
      } else if (nextPosition.row >= height) {
        nextPosition.row = nextPosition.row - height;
      }

      pawn.setCurrentPosition(nextPosition);
    }
    const quadrant = assignToQuadrant(pawn.currentPosition, width, height);
    if (quadrant !== "none") {
      countPerQuadrant[quadrant]++;
    }
  });

  return Object.values(countPerQuadrant).reduce((a, b) => a * b, 1);
};

export const solvePart2 = async (
  input: string,
  {
    nSeconds,
    width,
    height,
  }: {
    nSeconds: number;
    width: number;
    height: number;
  } = {
    // Puzzle parameters
    nSeconds: 100,
    width: 101,
    height: 103,
  }
) => {
  const board = new Board(Spaces.OPEN.repeat(width * height), width, height);

  const pawns = [];

  for (const line of input.trim().split("\n")) {
    const match = line.match(REGEX)!;
    const [px, py, vx, vy] = match?.slice(1, 5).map((x) => Number(x));

    pawns.push(
      new Pawn<{ vx: number; vy: number }>(
        board,
        { col: px, row: py },
        Direction.N,
        {
          vx,
          vy,
        }
      )
    );
  }

  for (let i = 0; i < nSeconds; i++) {
    pawns.forEach((pawn) => {
      const { vx, vy } = pawn.context!;

      const nextPosition = addCoordinates(pawn.currentPosition, {
        col: vx,
        row: vy,
      });

      if (nextPosition.col < 0) {
        nextPosition.col = width + nextPosition.col;
      } else if (nextPosition.col >= width) {
        nextPosition.col = nextPosition.col - width;
      }

      if (nextPosition.row < 0) {
        nextPosition.row = height + nextPosition.row;
      } else if (nextPosition.row >= height) {
        nextPosition.row = nextPosition.row - height;
      }

      board.setCell(Spaces.OPEN, pawn.currentPosition);
      pawn.setCurrentPosition(nextPosition);
      board.setCell(Spaces.WALL, pawn.currentPosition);
    });

    console.log(i);
    console.log(board.toString());

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return 0;
};
