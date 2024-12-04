export const solvePart1 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const asString = input.trim().replaceAll("\n", "");
  const board = new Board(asString, width);

  let count = 0;
  board.iterateOverX((val, { col, row }) => {
    const mNeighbours = board
      .neighbours({ col, row })
      .filter(
        (neighbour) =>
          board.getCell({ col: neighbour.col, row: neighbour.row }) ===
          Encoding.M
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
        }) === Encoding.A &&
        board.safeGetCell({
          col: mNeighbour.col + relativeDirection.col * 2,
          row: mNeighbour.row + relativeDirection.row * 2,
        }) === Encoding.S
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
  const board = new Board(asString, width);

  let count = 0;
  board.iterateOverA((val, { col, row }) => {
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
      (x) => board.safeGetCell({ col: x.col, row: x.row }) === Encoding.M
    );
    const sCells = crossNeighbours.filter(
      (x) => board.safeGetCell({ col: x.col, row: x.row }) === Encoding.S
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

const Decoding = {
  1: "X",
  2: "M",
  3: "A",
  4: "S",
};

const Encoding = {
  X: 1,
  M: 2,
  A: 3,
  S: 4,
};

// prettier-ignore
enum Direction {
  NW  = "NW", // ↖️
  N   = "N",  // ⬆️
  NE  = "NE", // ↗️
  W   = "W",  // ⬅️
  E   = "E",  // ➡️
  SW  = "SW", // ↙️
  S   = "S",  // ⬇️
  SE  = "SE", // ↘️
}

type Column = number;
type Row = number;
type Coordinate = {
  col: Column;
  row: Row;
};

const relativeCoords: Record<Direction, Coordinate> = {
  NW: {
    col: -1,
    row: -1,
  },
  N: {
    col: 0,
    row: -1,
  },
  NE: {
    col: 1,
    row: -1,
  },
  W: {
    col: -1,
    row: 0,
  },
  E: {
    col: 1,
    row: 0,
  },
  SW: {
    col: -1,
    row: 1,
  },
  S: {
    col: 0,
    row: 1,
  },
  SE: {
    col: 1,
    row: 1,
  },
};

const relativeCoordsList = Object.values(relativeCoords);

/**
 * Indexing columns and rows start at 0, going from left to right and top to bottom.
 * When providing coordinates, column first, then the row
 */
class Board {
  private _board: Uint8Array;
  private _xPostions: Coordinate[];
  private _aPositions: Coordinate[];
  private _width: number;

  constructor(board: string, width: number) {
    this._board = new Uint8Array(board.length);
    this._xPostions = [];
    this._aPositions = [];
    this._width = width;

    for (let i = 0; i < board.length; i++) {
      this._board[i] = Encoding[board[i] as keyof typeof Encoding]
        ? Encoding[board[i] as keyof typeof Encoding]
        : 0;

      if (board[i] === "X")
        this._xPostions.push({
          col: i % this._width,
          row: Math.floor(i / this._width),
        });

      if (board[i] === "A")
        this._aPositions.push({
          col: i % this._width,
          row: Math.floor(i / this._width),
        });
    }
  }

  /**
   * @TODO
   */
  iterateOverX(callback: (value: string, coord: Coordinate) => void) {
    this._xPostions.forEach(({ col, row }) => {
      callback("X", { col, row });
    });
  }

  /**
   * @TODO
   */
  iterateOverA(callback: (value: string, coord: Coordinate) => void) {
    this._aPositions.forEach(({ col, row }) => {
      callback("A", { col, row });
    });
  }

  /**
   * @TODO
   */
  neighbours(currentCoords: Coordinate, distance: number = 1) {
    const neighboursRelativeCoordinates = relativeCoordsList.map((coords) => ({
      col: coords.col * distance,
      row: coords.row * distance,
    }));

    return neighboursRelativeCoordinates
      .map((coord) => ({
        col: coord.col + currentCoords.col,
        row: coord.row + currentCoords.row,
      }))
      .filter((coord) =>
        this.isWithinBounds({ col: coord.col, row: coord.row })
      );
  }

  /**
   * Check if a cell is within the bounds of the board.
   * @param column - The column of the cell to check
   * @param row - The row of the cell to check
   * @returns true if the cell is within the bounds of the board, false otherwise
   * @TODO _width needs to be updated here
   */
  isWithinBounds(coord: Coordinate): boolean {
    return (
      coord.col >= 0 &&
      coord.col < this._width &&
      coord.row >= 0 &&
      coord.row < this._width
    );
  }

  /**
   * Get the value of a cell.
   * Will throw an error if the cell is out of bounds.
   * @param column - The column of the cell to get
   * @param row - The row of the cell to get
   * @returns the value of the cell
   */
  getCell(coord: Coordinate): number {
    if (!this.isWithinBounds(coord)) throw new Error("Cell is out of bounds");
    return this._board[coord.col + coord.row * this._width];
  }

  /**
   * Get the value of a cell.
   * @param column - The column of the cell to get
   * @param row - The row of the cell to get
   * @returns the value of the cell, if outside of bounds, return undefined.
   */
  safeGetCell(coord: Coordinate): number | undefined {
    if (!this.isWithinBounds(coord)) return undefined;
    return this._board[coord.col + coord.row * this._width];
  }

  /**
   * Abstracing away the double loop which performs looping over every cell in the board
   * @param callback - The callback function to be executed for each cell,
   *      receiving the value of the cell, and its column and row as arguments
   */
  iterateOverCells(callback: (value: number, coord: Coordinate) => void): void {
    for (let col = 0; col < this._width; col++) {
      for (let row = 0; row < this._width; row++) {
        const currCoord = { col, row };
        callback(this.getCell(currCoord), currCoord);
      }
    }
  }

  /**
   * Convert the board to a readable string, to be used for debugging in the terminal for example.
   * It will include newlines to separate the rows.
   * @returns the string representation of the board
   */
  toString(): string {
    let output = "";
    for (let i = 0; i < this._board.length; i++) {
      if (i % this._width === 0) output += "\n";
      output += Decoding[this._board[i] as keyof typeof Decoding]
        ? Decoding[this._board[i] as keyof typeof Decoding]
        : this._board[i];
    }
    return output;
  }
}
