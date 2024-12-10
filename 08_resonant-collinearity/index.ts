import {
  Coordinate,
  addCoordinates,
  subtractCoordinates,
  Board,
  stringifyCoord,
  equalCoordinates,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { forEachPair } from "../utils/list.ts";

export const solvePart1 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const map = input.trim().replaceAll("\n", "");
  const board = new Board(map, width);
  const possibleAntiNodes = new HashSet<Coordinate>(stringifyCoord);

  for (const char of board.allPossibleCharacters().filter((x) => x !== ".")) {
    const antennas = board.getPositionsByKey(char);

    forEachPair((a, b) => {
      const deltaAtoB = subtractCoordinates(b, a);
      const deltaBtoA = subtractCoordinates(a, b);

      const newA = addCoordinates(b, deltaAtoB);
      const newB = addCoordinates(a, deltaBtoA);

      if (
        board.isWithinBounds(newA) &&
        !antennas.find((c) => equalCoordinates(newA, c))
      )
        possibleAntiNodes.include(newA);
      if (
        board.isWithinBounds(newB) &&
        !antennas.find((c) => equalCoordinates(newB, c))
      )
        possibleAntiNodes.include(newB);
    }, board.getPositionsByKey(char));
  }

  return possibleAntiNodes.size;
};

export const solvePart2 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const map = input.trim().replaceAll("\n", "");
  const board = new Board(map, width);
  const possibleAntiNodes = new HashSet<Coordinate>(stringifyCoord);

  for (const char of board.allPossibleCharacters().filter((x) => x !== ".")) {
    forEachPair((a, b) => {
      const deltaAtoB = subtractCoordinates(b, a);
      const deltaBtoA = subtractCoordinates(a, b);

      // go from a -> b
      let currentPosition = a;
      while (board.isWithinBounds(currentPosition)) {
        possibleAntiNodes.include(currentPosition);
        currentPosition = addCoordinates(currentPosition, deltaAtoB);
      }

      // go from b -> a
      currentPosition = b;
      while (board.isWithinBounds(currentPosition)) {
        possibleAntiNodes.include(currentPosition);
        currentPosition = addCoordinates(currentPosition, deltaBtoA);
      }
    }, board.getPositionsByKey(char));
  }

  return possibleAntiNodes.size;
};
