import {
  Board,
  Coordinate,
  Direction,
  addCoordinates,
  destringifyCoord,
  equalCoordinates,
  relativeCoords,
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
    const sides = scanRegionSides(region.region, width, height);
    const regionPrice = region.region.size * sides;
    count += regionPrice;
  }
  return count;
};

const Spaces = {
  OPEN: ".",
  WALL: "X",
};

export const scanRegionSides = (
  region: HashSet<Coordinate>,
  width: number,
  height: number
) => {
  const board = new Board(
    Spaces.OPEN.repeat((width + 2) * (height + 2)),
    width + 2,
    height + 2
  );

  for (const coordStr of region.list()) {
    const coord = destringifyCoord(coordStr);
    board.setCell(Spaces.WALL, addCoordinates(coord, relativeCoords.SE));
  }

  // First key is the column, second key is the direction, value is the row
  const res = {} as Record<string, Record<string, number[]>>;
  const directions = [Direction.N, Direction.E, Direction.S, Direction.W];

  board.iterateOver(Spaces.WALL, (coord) => {
    let directionIndex = 0;
    board.neighbours(coord, directions).forEach((neighbor) => {
      if (board.getCell(neighbor) !== Spaces.WALL) {
        if (
          directions[directionIndex] === Direction.E ||
          directions[directionIndex] === Direction.W
        ) {
          res[coord.col] = res[coord.col] || {};
          res[coord.col][directions[directionIndex]] =
            res[coord.col][directions[directionIndex]] || [];
          res[coord.col][directions[directionIndex]].push(coord.row);
        }

        if (
          directions[directionIndex] === Direction.N ||
          directions[directionIndex] === Direction.S
        ) {
          res[coord.row] = res[coord.row] || {};
          res[coord.row][directions[directionIndex]] =
            res[coord.row][directions[directionIndex]] || [];
          res[coord.row][directions[directionIndex]].push(coord.col);
        }
      }
      directionIndex++;
    });
  });

  let countSides = 0;

  for (const n of Object.keys(res)) {
    const rowOrCol = res[n];
    for (const direction of Object.keys(rowOrCol)) {
      const values = rowOrCol[direction];
      const gaps = detectAmountOfGaps(values.toSorted((a, b) => a - b));
      countSides += gaps + 1;
    }
  }

  return countSides;
};
