import { BidirectionalMap } from "../utils/bidirectionalMap.ts";
import { Board, relativeCoords } from "../utils/board.ts";

const encoding = new BidirectionalMap<PropertyKey, number>({
  X: 1,
  M: 2,
  A: 3,
  S: 4,
});

export const solvePart1 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const asString = input.trim().replaceAll("\n", "");
  const board = new Board(asString, width, encoding);

  let count = 0;
  board.iterateOver("X", ({ col, row }) => {
    const mNeighbours = board
      .neighbours({ col, row })
      .filter(
        (neighbour) =>
          board.getCell({ col: neighbour.col, row: neighbour.row }) ===
          encoding.get("M")
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
        }) === encoding.get("A") &&
        board.safeGetCell({
          col: mNeighbour.col + relativeDirection.col * 2,
          row: mNeighbour.row + relativeDirection.row * 2,
        }) === encoding.get("S")
      ) {
        count++;
      }
    }
  });

  return count;
};

export const solvePart2 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const asString = input.trim().replaceAll("\n", "");

  const board = new Board(asString, width, encoding);

  let count = 0;

  board.iterateOver("A", ({ col, row }) => {
    const relativeCoordsNested = [
      relativeCoords.NW,
      relativeCoords.NE,
      relativeCoords.SW,
      relativeCoords.SE,
    ];

    const crossNeighbours = relativeCoordsNested.map((coord) => ({
      col: coord.col + col,
      row: coord.row + row,
    }));
    const mCells = crossNeighbours.filter(
      (x) => board.safeGetCell({ col: x.col, row: x.row }) === encoding.get("M")
    );
    const sCells = crossNeighbours.filter(
      (x) => board.safeGetCell({ col: x.col, row: x.row }) === encoding.get("S")
    );

    if (!(mCells.length === 2 && sCells.length === 2)) return;

    const firstM = mCells[0];
    const secondM = mCells[1];

    // If they're opposed to each other, this X-MAS is invalid, the M-M & S-S needs
    // to share at least a column or a row
    if (firstM.col !== secondM.col && firstM.row !== secondM.row) return;
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
