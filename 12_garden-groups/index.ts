import {
  Board,
  Coordinate,
  Direction,
  destringifyCoord,
  equalCoordinates,
  stringifyCoord,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { detectAmountOfGaps } from "../utils/list.ts";

export const solvePart1 = (input: string) => {
  const width = input.indexOf("\n");
  const height = input.trim().split("\n").length;
  const inputAsStr = input.trim().replaceAll(/\s/g, "");
  const board = new Board(inputAsStr, width, height);

  const regions = new Map<
    number,
    {
      region: HashSet<Coordinate>;
      value: string;
    }
  >();
  const visited = new HashSet<Coordinate>(stringifyCoord);

  board.iterateOverCells((value, coord) => {
    if (!visited.contains(coord)) {
      const region = floodFill(coord, value, visited, board);
      visited.union(region);
      regions.set(regions.size, { region, value });
    }
  });

  let count = 0;
  for (const region of regions.values()) {
    const regionPrice = region.region.size * scanRegionPerimeter(region.region);
    count += regionPrice;
  }

  // DEBUGGING
  // const debugBoard = new Board(" ".repeat(140 * 140), 140, 140);

  // regions.values().forEach(({ region, value }) => {
  //   region.forEach((coord) => {
  //     debugBoard.setCell(value, destringifyCoord(coord));
  //   });
  // });
  // console.log(debugBoard.toString());

  return count;
};

export const scanRegionPerimeter = (region: HashSet<Coordinate>) => {
  const board = new Board(".".repeat(140 * 140), 140, 140);

  for (const coordStr of region.list()) {
    const coord = destringifyCoord(coordStr);
    board.setCell("X", coord);
  }

  let bigCount = 0;
  board.iterateOver("X", (coord) => {
    let count = 4;

    board
      .neighbours(coord, [Direction.N, Direction.E, Direction.S, Direction.W])
      .forEach((neighbor) => {
        if (board.getCell(neighbor) === "X") {
          count--;
        }
      });

    bigCount += count;
  });

  return bigCount;
};

// Feel like this should work, figure out later what's wrong with it
// export const scanRegionPerimeter = (region: HashSet<Coordinate>) => {
//   const list = region.list().map(destringifyCoord);

//   const groupedPerCol = new Map<number, number[]>();
//   const groupedPerRow = new Map<number, number[]>();

//   for (const coord of list) {
//     groupedPerCol.set(coord.col, [
//       ...(groupedPerCol.get(coord.col) || []),
//       coord.row,
//     ]);

//     groupedPerRow.set(coord.row, [
//       ...(groupedPerRow.get(coord.row) || []),
//       coord.col,
//     ]);
//   }

//   const perimetersCol = groupedPerCol.values().reduce((acc, curr) => {
//     // @TODO Could sort beforehand
//     const gaps = detectAmountOfGaps(curr.toSorted());
//     return acc + (gaps + 1) * 2;
//   }, 0);

//   const perimetersRow = groupedPerRow.values().reduce((acc, curr) => {
//     const gaps = detectAmountOfGaps(curr.toSorted());
//     return acc + (gaps + 1) * 2;
//   }, 0);

//   return perimetersCol + perimetersRow;
// };

const floodFill = (
  coord: Coordinate,
  value: string,
  visited: HashSet<Coordinate>,
  board: Board<PropertyKey, number>
): HashSet<Coordinate> => {
  const region = new HashSet<Coordinate>(stringifyCoord);

  // BFS
  const queue: Coordinate[] = [coord];
  while (queue.length > 0) {
    const current = queue.shift()!;

    region.include(current);
    visited.include(current);

    const neighbors = board.neighbours(current, [
      Direction.N,
      Direction.E,
      Direction.S,
      Direction.W,
    ]);

    neighbors.forEach((neighbor) => {
      if (
        !visited.contains(neighbor) &&
        board.getCell(neighbor) === value &&
        // This can be better too
        !queue.find((c) => equalCoordinates(c, neighbor))
      ) {
        queue.push(neighbor);
      }
    });
  }

  return region;
};

export const solvePart2 = (input: string) => {
  return 0;
};
