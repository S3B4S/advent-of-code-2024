import { BijectiveMap } from "./bijectiveMap.ts";

export const Characters = {
  /**
   * █
   */
  WhiteRetroBlock: "█",

  /**
   *
   */
  Space: " ",

  /**
   * .
   */
  Dot: ".",

  /**
   * \#
   */
  HashTag: "#",

  /**
   * ~
   */
  Tilde: "~",

  /**
   * \*
   */
  Star: "*",

  /**
   * \+
   */
  Plus: "+",

  /**
   * @
   */
  At: "@",
};

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

export const dpadDirections = [
  Direction.N,
  Direction.E,
  Direction.S,
  Direction.W,
];

export const addCoordinates = (coordA: Coordinate, coordB: Coordinate) => {
  return {
    col: coordA.col + coordB.col,
    row: coordA.row + coordB.row,
  };
};

export const addDirectionToCoordinate = (
  coord: Coordinate,
  direction: Direction
) => {
  return addCoordinates(coord, relativeCoords[direction]);
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
  // @TODO replace by HashSet
  private _positionsByKey: Record<K, Coordinate[]>;
  private _width: number;
  private _height: number;
  // X will be the readable characters, Y will be the encoded values (numbers)
  encoding: BijectiveMap<K, V> = new BijectiveMap<K, V>();

  static fromUnparsedBoard(unparsedBoard: string) {
    const width = unparsedBoard.trim().indexOf("\n");
    const height = unparsedBoard.trim().split("\n").length;
    const boardAsStr = unparsedBoard.trim().replaceAll(/\s/g, "");
    return new Board<string, number>(boardAsStr, width, height);
  }

  constructor(boardAsStr: string, width: number, height: number) {
    this._board = new Uint8Array(boardAsStr.length);
    this._positionsByKey = {} as Record<K, Coordinate[]>;
    this._width = width;
    this._height = height;

    let currentEncodingValue = 0 as V;
    for (let i = 0; i < boardAsStr.length; i++) {
      const currentChar = boardAsStr[i] as K;
      if (!this.encoding.hasX(currentChar)) {
        this.encoding.set(currentChar, currentEncodingValue);
        currentEncodingValue++;
      }

      this._board[i] = this.encoding.getY(currentChar)!;

      if (!this._positionsByKey[currentChar]) {
        this._positionsByKey[currentChar] = [];
      }

      this._positionsByKey[currentChar].push({
        col: i % this._width,
        row: Math.floor(i / this._width),
      });
    }
  }

  /**
   * @TODO Doesn't update the positions by key
   */
  setCell(val: K, coord: Coordinate) {
    if (!this.isWithinBounds(coord)) return false;

    if (!this.encoding.hasX(val)) {
      this.encoding.set(val, this.encoding.size as V);
    }

    if (!this._positionsByKey[val]) {
      this._positionsByKey[val] = [];
    }

    const arrayIndex = coord.col + coord.row * this._width;

    // Remove the old value from the positions by key
    const oldVal = this.encoding.getX(this._board[arrayIndex] as V)!;
    const positionIndex = this._positionsByKey[oldVal].findIndex((c) =>
      equalCoordinates(c, coord)
    );
    this._positionsByKey[oldVal].splice(positionIndex, 1);

    // Add the new value to the positions by key
    this._positionsByKey[val].push(coord);

    // Set the new value in the board
    this._board[arrayIndex] = this.encoding.getY(val)! as number;

    return true;
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
  getNeighbours(
    currentCoords: Coordinate,
    allowlistDirections?: Direction[],
    distance: number = 1
  ) {
    let neighboursRelativeCoordinates;

    if (allowlistDirections) {
      neighboursRelativeCoordinates = allowlistDirections.map((dir) => {
        const relCoord = relativeCoords[dir];
        return {
          col: relCoord.col * distance,
          row: relCoord.row * distance,
        };
      });
      // (
      //   Object.entries(relativeCoords) as [Direction, Coordinate][]
      // )
      //   .filter(([dir]) => customRelativeCoords.includes(dir))
      //   .map(([dir, coords]) => ({
      //     col: coords.col * distance,
      //     row: coords.row * distance,
      //   }));
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
   */
  isWithinBounds(coord: Coordinate): boolean {
    return (
      coord.col >= 0 &&
      coord.col < this._width &&
      coord.row >= 0 &&
      coord.row < this._height
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
    return this.encoding?.getX(
      this._board[coord.col + coord.row * this._width] as V
    );
  }

  /**
   * Get the value of a cell.
   * @param column - The column of the cell to get
   * @param row - The row of the cell to get
   * @returns the value of the cell, if outside of bounds, return undefined.
   */
  safeGetCell(coord: Coordinate): K | undefined {
    if (!this.isWithinBounds(coord)) return undefined;
    return this.encoding.getX(
      this._board[coord.col + coord.row * this._width] as V
    );
  }

  getPositionsByKey(key: K) {
    return this._positionsByKey[key];
  }

  allPossibleCharacters() {
    return (Object.entries(this._positionsByKey) as [K, Coordinate[]][])
      .filter(([_, value]) => value.length > 0)
      .map(([key]) => key);
  }

  /**
   * Abstracing away the double loop which performs looping over every cell in the board
   * @param callback - The callback function to be executed for each cell,
   *      receiving the value of the cell, and its column and row as arguments
   * @TODO shouldn't be undefined
   */
  iterateOverCells(callback: (value: string, coord: Coordinate) => void): void {
    for (let row = 0; row < this._height; row++) {
      for (let col = 0; col < this._width; col++) {
        const currCoord = { col, row };
        callback(this.getCell(currCoord) as string, currCoord);
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
      output += this.encoding?.getX(this._board[i] as V) as string;
    }
    return output;
  }
}

export type StringifiedCoord = string;
export const stringifyCoord = (coord: Coordinate): StringifiedCoord =>
  String(coord.col) + "," + String(coord.row);

export const destringifyCoord = (coord: string) => {
  const [col, row] = coord.split(",");
  return { col: Number(col), row: Number(row) };
};

export const destringifyCoordDirection = (coord: string) => {
  const [col, row, direction] = coord.split(",");
  return {
    col: Number(col),
    row: Number(row),
    direction: direction as Direction,
  };
};

export const stringifyCoordDirection = (
  coord: Coordinate,
  direction: Direction
) => String(coord.col) + "," + String(coord.row) + "," + String(direction);

export const turn180Degrees = (direction: Direction): Direction => {
  return turn90DegreesClockWise(turn90DegreesClockWise(direction));
};

export const turn90DegreesClockWise = (direction: Direction): Direction => {
  return (
    {
      [Direction.N]: Direction.E,
      [Direction.NE]: Direction.SE,
      [Direction.E]: Direction.S,
      [Direction.SE]: Direction.SW,
      [Direction.S]: Direction.W,
      [Direction.SW]: Direction.NW,
      [Direction.W]: Direction.N,
      [Direction.NW]: Direction.NE,
    }[direction] || Direction.N
  );
};

export const turn45DegreesClockWise = (direction: Direction): Direction => {
  return (
    {
      [Direction.N]: Direction.NE,
      [Direction.NE]: Direction.E,
      [Direction.E]: Direction.SE,
      [Direction.SE]: Direction.S,
      [Direction.S]: Direction.SW,
      [Direction.SW]: Direction.W,
      [Direction.W]: Direction.NW,
      [Direction.NW]: Direction.N,
    }[direction] || Direction.N
  );
};

export const turn90DegreesCounterClockwise = (
  direction: Direction
): Direction => {
  return (
    {
      [Direction.N]: Direction.W,
      [Direction.NW]: Direction.SW,
      [Direction.W]: Direction.S,
      [Direction.SW]: Direction.SE,
      [Direction.S]: Direction.E,
      [Direction.SE]: Direction.NE,
      [Direction.E]: Direction.N,
      [Direction.NE]: Direction.NW,
    }[direction] || Direction.N
  );
};

export const turn45DegreesCounterClockwise = (
  direction: Direction
): Direction => {
  return (
    {
      [Direction.N]: Direction.NW,
      [Direction.NW]: Direction.W,
      [Direction.W]: Direction.SW,
      [Direction.SW]: Direction.S,
      [Direction.S]: Direction.SE,
      [Direction.SE]: Direction.E,
      [Direction.E]: Direction.NE,
      [Direction.NE]: Direction.N,
    }[direction] || Direction.N
  );
};

export const directionArrows = {
  [Direction.N]: "⬆️",
  [Direction.E]: "➡️",
  [Direction.S]: "⬇️",
  [Direction.W]: "⬅️",
};
