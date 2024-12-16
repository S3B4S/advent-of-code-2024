import {
  addCoordinates,
  Board,
  Coordinate,
  relativeCoords,
} from "../utils/board.ts";
import { partition } from "ramda";

export const solvePart1 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const height = input.trim().split("\n").length;
  const asString = input.trim().replaceAll("\n", "");
  const board = new Board(asString, width, height);

  let count = 0;
  board.iterateOver("X", ({ col, row }) => {
    const mNeighbours = board
      .getNeighbours({ col, row })
      .filter(
        (neighbour) =>
          board.getCell({ col: neighbour.col, row: neighbour.row }) === "M"
      );

    for (const mNeighbour of mNeighbours) {
      const relativeDirection = {
        col: mNeighbour.col - col,
        row: mNeighbour.row - row,
      };

      if (
        board.safeGetCell({
          col: mNeighbour.col + relativeDirection.col,
          row: mNeighbour.row + relativeDirection.row,
        }) === "A" &&
        board.safeGetCell({
          col: mNeighbour.col + relativeDirection.col * 2,
          row: mNeighbour.row + relativeDirection.row * 2,
        }) === "S"
      ) {
        count++;
      }
    }
  });

  return count;
};

const crossDirections = [
  relativeCoords.NW,
  relativeCoords.NE,
  relativeCoords.SW,
  relativeCoords.SE,
];

export const solvePart2 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const height = input.trim().split("\n").length;
  const asString = input.trim().replaceAll("\n", "");
  const board = new Board(asString, width, height);

  let count = 0;

  board.iterateOver("A", (centre) => {
    const crossNeighbours = crossDirections.map((crossDirection) =>
      addCoordinates(centre, crossDirection)
    );

    // prettier-ignore
    // If any of the neighbours are not an M or S, skip it
    for (const nb of crossNeighbours) {
      const el = board.safeGetCell(nb)
      if(!(el === 'M' || el === 'S')) return;
    }

    const [mCells, sCells] = partition((el: Coordinate) => {
      return board.safeGetCell(el) === "M";
    }, crossNeighbours);

    if (!(mCells.length === 2 && sCells.length === 2)) return;

    // If they're opposed to each other, this X-MAS is invalid, the M-M & S-S needs
    // to share at least a column or a row
    if (mCells[0].col !== mCells[1].col && mCells[0].row !== mCells[1].row)
      return;

    count++;
  });

  return count;
};

const _solvePart2Alternative = (input: string) => {
  const sam = "SAM";
  const mas = "MAS";

  const rows = input.trim().split("\n");
  const matrixWidth = rows[0].length;
  const matrixHeight = rows.length;

  let count = 0;

  for (let i = 0; i < matrixHeight; i++) {
    const safeDown = i + 2 < matrixHeight;

    for (let j = 0; j < matrixWidth; j++) {
      if (!(rows[i][j] === "S" || rows[i][j] === "M")) {
        continue;
      }

      const safeRight = j + 2 < matrixWidth;

      if (!(safeDown && safeRight)) continue;

      const toSouthEast = rows[i][j] + rows[i + 1][j + 1] + rows[i + 2][j + 2];
      const toNorthEast = rows[i + 2][j] + rows[i + 1][j + 1] + rows[i][j + 2];

      if (
        (toSouthEast === sam || toSouthEast === mas) &&
        (toNorthEast === sam || toNorthEast === mas)
      ) {
        count++;
      }
    }
  }

  return count;
};
