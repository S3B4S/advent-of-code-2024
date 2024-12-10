import { Coordinate, Direction, equalCoordinates } from "../utils/board.ts";
import { stringifyCoord } from "../utils/board.ts";
import { Board } from "../utils/board.ts";
import { HashMap } from "../utils/hashMap.ts";

export const solvePart1 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const inputAsStr = input.trim().replaceAll("\n", "");

  const board = new Board(inputAsStr, width);

  // BFS
  // Also backtrack to find out which nodes will lead to a successful path

  const endDestinations = new HashMap<{
    startingFrom: Coordinate;
    endingAt: Coordinate;
  }>(({ startingFrom, endingAt }) => {
    return stringifyCoord(startingFrom) + "|" + stringifyCoord(endingAt);
  });

  board.iterateOver("0", (startingFrom) => {
    const toVisitList = new Queue<{
      coord: Coordinate;
      lookingFor: number;
      path: Coordinate[];
    }>();
    toVisitList.add({
      coord: startingFrom,
      lookingFor: 1,
      path: [startingFrom],
    });

    while (!toVisitList.isEmpty()) {
      const { coord: visiting, lookingFor, path } = toVisitList.remove()!;

      for (const neighbour of board.neighbours(visiting, [
        Direction.N,
        Direction.E,
        Direction.S,
        Direction.W,
      ])) {
        if (path.find((prevCoord) => equalCoordinates(prevCoord, neighbour)))
          continue;

        if (board.getCell(neighbour) === "9" && lookingFor === 9) {
          endDestinations.add({ startingFrom, endingAt: neighbour });
          continue;
        }

        if (board.getCell(neighbour) === String(lookingFor)) {
          toVisitList.add({
            coord: neighbour,
            lookingFor: lookingFor + 1,
            path: [...path, neighbour],
          });
        }
      }
    }
  });

  return endDestinations.size;
};

export const solvePart2 = (input: string) => {
  const width = input.trim().split("\n")[0].length;
  const inputAsStr = input.trim().replaceAll("\n", "");

  const board = new Board(inputAsStr, width);

  // BFS
  // Also backtrack to find out which nodes will lead to a successful path

  const possiblePaths = new HashMap<Coordinate[]>((path) => {
    return path.map(stringifyCoord).join("|");
  });

  board.iterateOver("0", (startingFrom) => {
    const toVisitList = new Queue<{
      coord: Coordinate;
      lookingFor: number;
      path: Coordinate[];
    }>();
    toVisitList.add({
      coord: startingFrom,
      lookingFor: 1,
      path: [startingFrom],
    });

    while (!toVisitList.isEmpty()) {
      const { coord: visiting, lookingFor, path } = toVisitList.remove()!;

      for (const neighbour of board.neighbours(visiting, [
        Direction.N,
        Direction.E,
        Direction.S,
        Direction.W,
      ])) {
        if (path.find((prevCoord) => equalCoordinates(prevCoord, neighbour)))
          continue;

        if (board.getCell(neighbour) === "9" && lookingFor === 9) {
          possiblePaths.add([...path, neighbour]);
          continue;
        }

        if (board.getCell(neighbour) === String(lookingFor)) {
          toVisitList.add({
            coord: neighbour,
            lookingFor: lookingFor + 1,
            path: [...path, neighbour],
          });
        }
      }
    }
  });

  return possiblePaths.size;
};

class Queue<T> {
  private _list: T[] = [];

  add(item: T) {
    this._list.push(item);
  }

  peek() {
    return this._list[0];
  }

  remove() {
    return this._list.shift();
  }

  list() {
    return this._list;
  }

  isEmpty() {
    return this._list.length === 0;
  }
}
