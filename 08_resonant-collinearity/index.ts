import { BidirectionalMap } from "../utils/bidirectionalMap.ts";
import {
  Coordinate,
  addCoordinates,
  subtractCoordinates,
  Board,
  stringifyCoord,
  equalCoordinates,
} from "../utils/board.ts";
import { HashMap } from "../utils/hashMap.ts";

const uniqueChars = (str: string) => {
  const chars = new HashMap<string>((c) => c);

  for (let i = 0; i < str.length; i++) {
    chars.add(str[i]);
  }

  return chars;
};

export const solvePart1 = (input: string) => {
  const heigh = input.trim().split("\n").length;
  const width = input.trim().split("\n")[0].length;
  const map = input.trim().replaceAll("\n", "");

  const allCharacters = uniqueChars(map).list();
  const encoding = new BidirectionalMap<string, number>(
    Object.fromEntries(
      allCharacters.map((x, index) => [x, index]).concat([["#", 100]])
    )
  );

  // console.log(encoding);

  const board = new Board(map, width, encoding);

  // console.log(board.getPositionsByKey("0"));

  const possibleAntiNodes = new HashMap<Coordinate>(stringifyCoord);

  for (const char of allCharacters.filter((x) => x !== ".")) {
    const antennas = board.getPositionsByKey(char);

    console.log("char", char);
    forEachPair((a, b) => {
      const deltaAtoB = subtractCoordinates(b, a);
      const deltaBtoA = subtractCoordinates(a, b);

      const newA = addCoordinates(b, deltaAtoB);
      const newB = addCoordinates(a, deltaBtoA);

      if (
        board.isWithinBounds(newA) &&
        !antennas.find((c) => equalCoordinates(newA, c))
      )
        possibleAntiNodes.add(newA);
      if (
        board.isWithinBounds(newB) &&
        !antennas.find((c) => equalCoordinates(newB, c))
      )
        possibleAntiNodes.add(newB);
      // console.log(newA);
      // console.log(newB);
      // board.setCell(100, newA);
      // board.setCell(100, newB);
    }, board.getPositionsByKey(char));
  }

  for (const antiNode of possibleAntiNodes.list()) {
    board.setCell(100, destringCoordinate(antiNode));
  }
  // console.log(board.toString(encoding));
  return possibleAntiNodes.size();
};

const destringCoordinate = (coord: string) => {
  const [col, row] = coord.split(",").map((x) => Number(x));
  return { col, row };
};

const forEachPair = <T>(callback: (a: T, b: T) => void, list: T[]) => {
  for (let i = 0; i < list.length - 1; i++) {
    for (let j = i; j < list.length; j++) {
      callback(list[i], list[j]);
    }
  }
};

export const solvePart2 = (input: string) => {
  return 0;
};
