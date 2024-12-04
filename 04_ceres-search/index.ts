export const solvePart1 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const asString = input.trim().replaceAll("\n", "");
  const board = new Board(asString, width);

  let count = 0;
  board.iterateOverX((val, col, row) => {
    const mNeighbours = board
      .neighbours([col, row])
      .filter(
        (neighbour) => board.getCell(neighbour[0], neighbour[1]) === Encoding.M
      );
    for (const mNeighbour of mNeighbours) {
      const relativeDirection = [mNeighbour[0] - col, mNeighbour[1] - row];

      if (
        board.safeGetCell(
          mNeighbour[0] + relativeDirection[0],
          mNeighbour[1] + relativeDirection[1]
        ) === Encoding.A &&
        board.safeGetCell(
          mNeighbour[0] + relativeDirection[0] * 2,
          mNeighbour[1] + relativeDirection[1] * 2
        ) === Encoding.S
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
  board.iterateOverA((val, col, row) => {
    const relativeCoords = [
      [-1, -1], // NW
      [1, 1], // NE
      [-1, 1], // SW
      [1, -1], // SE
    ];

    const crossNeighbours = relativeCoords.map((coord) => [
      coord[0] + col,
      coord[1] + row,
    ]);
    const mCells = crossNeighbours.filter(
      (x) => board.safeGetCell(x[0], x[1]) === Encoding.M
    );
    const sCells = crossNeighbours.filter(
      (x) => board.safeGetCell(x[0], x[1]) === Encoding.S
    );

    if (!(mCells.length === 2 && sCells.length === 2)) return;

    const firstM = mCells[0];
    const secondM = mCells[1];

    // If they're opposed to each other, this X-MAS is invalid, the M-M & S-S needs
    // to share at least a column or a row
    if (firstM[0] !== secondM[0] && firstM[1] !== secondM[1]) return;
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

/**
 * Indexing columns and rows start at 0, going from left to right and top to bottom.
 * When providing coordinates, column first, then the row
 */
class Board {
  private _board: Uint8Array;
  private _xPostions: [number, number][];
  private _aPositions: [number, number][];
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
        this._xPostions.push([i % this._width, Math.floor(i / this._width)]);

      if (board[i] === "A")
        this._aPositions.push([i % this._width, Math.floor(i / this._width)]);
    }
  }

  /**
   * @TODO
   */
  iterateOverX(callback: (value: string, column: number, row: number) => void) {
    this._xPostions.forEach(([col, row]) => {
      callback("X", col, row);
    });
  }

  /**
   * @TODO
   */
  iterateOverA(callback: (value: string, column: number, row: number) => void) {
    this._aPositions.forEach(([col, row]) => {
      callback("A", col, row);
    });
  }

  /**
   * @TODO
   */
  neighbours(currentCoords: [number, number], distance: number = 1) {
    const neighboursRelativeCoordinates = [
      [-1 * distance, -1 * distance], // NW
      [0 * distance, -1 * distance], // N
      [1 * distance, -1 * distance], // NE
      [-1 * distance, 0 * distance], // W
      [1 * distance, 0 * distance], // E
      [-1 * distance, 1 * distance], // SW
      [0 * distance, 1 * distance], // S
      [1 * distance, 1 * distance], // SE
    ];

    return neighboursRelativeCoordinates
      .map((coord) => [
        coord[0] + currentCoords[0],
        coord[1] + currentCoords[1],
      ])
      .filter((coord) => this.isWithinBounds(coord[0], coord[1]));
  }

  /**
   * Check if a cell is within the bounds of the board.
   * @param column - The column of the cell to check
   * @param row - The row of the cell to check
   * @returns true if the cell is within the bounds of the board, false otherwise
   */
  isWithinBounds(column: number, row: number): boolean {
    return column >= 0 && column < this._width && row >= 0 && row < this._width;
  }

  /**
   * Get the value of a cell.
   * Will throw an error if the cell is out of bounds.
   * @param column - The column of the cell to get
   * @param row - The row of the cell to get
   * @returns the value of the cell
   */
  getCell(column: number, row: number): number {
    if (!this.isWithinBounds(column, row))
      throw new Error("Cell is out of bounds");
    return this._board[column + row * this._width];
  }

  /**
   * Get the value of a cell.
   * Will throw an error if the cell is out of bounds.
   * @param column - The column of the cell to get
   * @param row - The row of the cell to get
   * @returns the value of the cell
   * @TODO
   */
  safeGetCell(column: number, row: number): number | undefined {
    if (!this.isWithinBounds(column, row)) return undefined;
    return this._board[column + row * this._width];
  }

  /**
   * Abstracing away the double loop which performs looping over every cell in the board
   * @param callback - The callback function to be executed for each cell,
   *      receiving the value of the cell, and its column and row as arguments
   */
  iterateOverCells(
    callback: (value: number, column: number, row: number) => void
  ): void {
    for (let row = 0; row < this._width; row++) {
      for (let column = 0; column < this._width; column++) {
        callback(this.getCell(column, row), column, row);
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
