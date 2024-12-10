import { CHAR_HYPHEN_MINUS } from "https://deno.land/std@0.224.0/path/_common/constants.ts";
import { BijectiveMap } from "./bijectiveMap.ts";

// prettier-ignore
export enum Direction {
  NW  = "NW", // ↖️
  N   = "N",  // ⬆️
  NE  = "NE", // ↗️
  W   = "W",  // ⬅️
  E   = "E",  // ➡️
  SW  = "SW", // ↙️
  S   = "S",  // ⬇️
  SE  = "SE", // ↘️
}

export type Column = number;
export type Row = number;
export type Coordinate = {
  col: Column;
  row: Row;
};

export const relativeCoords: Record<Direction, Coordinate> = {
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

export const relativeCoordsList = Object.values(relativeCoords);

export const addCoordinates = (coordA: Coordinate, coordB: Coordinate) => {
  return {
    col: coordA.col + coordB.col,
    row: coordA.row + coordB.row,
  };
};

export const subtractCoordinates = (coordA: Coordinate, coordB: Coordinate) => {
  return {
    col: coordA.col - coordB.col,
    row: coordA.row - coordB.row,
  };
};

export const equalCoordinates = (coordA: Coordinate, coordB: Coordinate) => {
  return coordA.col === coordB.col && coordA.row === coordB.row;
};

/**
 * Indexing columns and rows start at 0, going from left to right and top to bottom.
 * When providing coordinates, column first, then the row
 *
 * If an encoding is passed, and there are characters in the board not present in the encoding,
 * it will be converted to a blank space, represented by a 255 (the maximum value)
 */
export class Board<K extends PropertyKey, V extends number> {
  private _board: Uint8Array;
  private _positionsByKey: Record<K, Coordinate[]>;
  private _width: number;
  encoding: BijectiveMap<K, V> = new BijectiveMap<K, V>();

  constructor(boardAsStr: string, width: number) {
    this._board = new Uint8Array(boardAsStr.length);
    this._positionsByKey = {} as Record<K, Coordinate[]>;
    this._width = width;

    let currentEncodingValue = 0 as V;
    for (let i = 0; i < boardAsStr.length; i++) {
      const currentChar = boardAsStr[i] as K;
      if (!this.encoding.hasX(currentChar)) {
        this.encoding.set(currentChar, currentEncodingValue);
        currentEncodingValue++;
      }

      this._board[i] = this.encoding.getYByX(currentChar)!;

      if (!this._positionsByKey[currentChar]) {
        this._positionsByKey[currentChar] = [];
      }

      this._positionsByKey[currentChar].push({
        col: i % this._width,
        row: Math.floor(i / this._width),
      });
    }
  }

  setCell(val: K, coord: Coordinate) {
    this._board[coord.col + coord.row * this._width] = this.encoding.getYByX(
      val
    )! as number;
  }

  /**
   * @TODO
   */
  iterateOver(key: K, callback: (coord: Coordinate) => void) {
    if (!this._positionsByKey[key]) return;
    this._positionsByKey[key].forEach(({ col, row }) => {
      callback({ col, row });
    });
  }

  /**
   * @TODO
   */
  neighbours(
    currentCoords: Coordinate,
    customRelativeCoords?: Direction[],
    distance: number = 1
  ) {
    let neighboursRelativeCoordinates;

    if (customRelativeCoords) {
      neighboursRelativeCoordinates = (
        Object.entries(relativeCoords) as [Direction, Coordinate][]
      )
        .filter(([dir]) => customRelativeCoords.includes(dir))
        .map(([dir, coords]) => ({
          col: coords.col * distance,
          row: coords.row * distance,
        }));
    } else {
      neighboursRelativeCoordinates = relativeCoordsList.map((coords) => ({
        col: coords.col * distance,
        row: coords.row * distance,
      }));
    }

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
  getCell(coord: Coordinate): K | undefined {
    if (!this.isWithinBounds(coord)) throw new Error("Cell is out of bounds");
    return this.encoding?.getXByY(
      this._board[coord.col + coord.row * this._width] as V
    );
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

  getPositionsByKey(key: K) {
    return this._positionsByKey[key];
  }

  allPossibleCharacters() {
    return this.encoding.listX();
  }

  /**
   * Abstracing away the double loop which performs looping over every cell in the board
   * @param callback - The callback function to be executed for each cell,
   *      receiving the value of the cell, and its column and row as arguments
   * @TODO shouldn't be undefined
   */
  iterateOverCells(
    callback: (value: K | undefined, coord: Coordinate) => void
  ): void {
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
      output += this.encoding?.getXByY(this._board[i] as V) as string;
    }
    return output;
  }
}

export const stringifyCoord = (coord: Coordinate) =>
  String(coord.col) + "," + String(coord.row);

export const stringifyCoordDirection = (
  coord: Coordinate,
  direction: Direction
) => String(coord.col) + "," + String(coord.row) + "," + String(direction);

export const turn90DegreesClockWise = (direction: Direction): Direction => {
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

export const turn90DegreesCounterClockwise = (
  direction: Direction
): Direction => {
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

export const directionArrows = {
  [Direction.N]: "⬆️",
  [Direction.E]: "➡️",
  [Direction.S]: "⬇️",
  [Direction.W]: "⬅️",
};
