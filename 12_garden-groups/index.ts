import { completionShTemplate } from "https://deno.land/x/yargs@v17.7.2-deno/build/lib/completion-templates.js";
import {
  Board,
  Coordinate,
  Direction,
  addCoordinates,
  destringifyCoord,
  equalCoordinates,
  relativeCoords,
  stringifyCoord,
  stringifyCoordDirection,
  turn90DegreesClockWise,
  turn45DegreesClockWise,
  turn45DegreesCounterClockwise,
  turn90DegreesCounterClockwise,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { detectAmountOfGaps } from "../utils/list.ts";
import { Pawn } from "../utils/pawn.ts";
import { logId } from "../utils/misc.ts";

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
    const sides = scanRegionSides(region.region);
    const regionPrice = region.region.size * sides;
    // console.log(
    //   "value:",
    //   region.value,
    //   "size:",
    //   region.region.size,
    //   "sides:",
    //   sides,
    //   "price:",
    //   regionPrice
    // );
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

const Spaces = {
  OPEN: ".",
  WALL: "X",
};

export const scanRegionSides = (region: HashSet<Coordinate>) => {
  const board = new Board(".".repeat(10 * 10), 10, 10);

  for (const coordStr of region.list()) {
    const coord = destringifyCoord(coordStr);
    board.setCell("X", addCoordinates(coord, relativeCoords.SE));
  }

  // Coordinate stringified
  const perimetersByCoordinate = new Map<string, Direction[]>();

  // console.log(board.toString());
  const directions = [Direction.N, Direction.E, Direction.S, Direction.W];
  board.iterateOver("X", (coord) => {
    let directionIndex = 0;
    board.neighbours(coord, directions).forEach((neighbor) => {
      if (!perimetersByCoordinate.has(stringifyCoord(coord))) {
        perimetersByCoordinate.set(stringifyCoord(coord), []);
      }

      if (board.getCell(neighbor) !== "X") {
        // console.log(coord, neighbor, directions[directionIndex]);
        perimetersByCoordinate.set(stringifyCoord(coord), [
          ...perimetersByCoordinate.get(stringifyCoord(coord))!,
          directions[directionIndex],
        ]);
      }
      directionIndex++;
    });
  });

  // console.log(board.toString());

  let countSides = 0;

  // Scan per column
  const sortedKeysCols = [...perimetersByCoordinate.keys()].toSorted(
    (coordStrA, coordStrB) => {
      const { col: colA, row: rowA } = destringifyCoord(coordStrA);
      const { col: colB, row: rowB } = destringifyCoord(coordStrB);
      return colA - colB || rowA - rowB;
    }
  );

  const groupedByCol = sortedKeysCols.reduce((acc, curr) => {
    const { col: colA } = destringifyCoord(curr);
    acc[colA] = acc[colA] || [];
    acc[colA].push(curr);
    return acc;
  }, {} as Record<string, string[]>);

  // Fill gaps in the groups
  for (const colKey of Object.keys(groupedByCol) as string[]) {
    const col = groupedByCol[colKey];
    const startingRow = destringifyCoord(col[0]).row;
    const endingRow = destringifyCoord(col[col.length - 1]).row;

    for (let i = startingRow; i < endingRow; i++) {
      const coord = stringifyCoord({ col: parseInt(colKey), row: i });
      // console.log(coord);
      if (!groupedByCol[colKey].includes(coord)) {
        groupedByCol[colKey].push(coord);
      }
    }

    groupedByCol[colKey].sort((coordStrA, coordStrB) => {
      const { col: colA, row: rowA } = destringifyCoord(coordStrA);
      const { col: colB, row: rowB } = destringifyCoord(coordStrB);
      return colA - colB || rowA - rowB;
    });
  }

  // console.log(groupedByCol);

  let eFlag = false;
  let wFlag = false;
  // let currentCol = 0;
  for (const [column, coordinates] of Object.entries(groupedByCol)) {
    // if (currentCol !== destringifyCoord(sortedKeyCol).col) {
    // currentCol = destringifyCoord(sortedKeyCol).col;
    // console.log(currentCol);
    // console.log(countSides);
    // }

    const currentPerimetersCol = coordinates.map(
      (c) => perimetersByCoordinate.get(c) || []
    )!;

    for (const currentPerimeters of currentPerimetersCol) {
      // Keep track of consecutive E and Ws
      if (currentPerimeters.includes(Direction.E)) {
        if (!eFlag) {
          countSides++;
        }
        eFlag = true;
      } else {
        eFlag = false;
      }

      if (currentPerimeters.includes(Direction.W)) {
        if (!wFlag) {
          countSides++;
        }
        wFlag = true;
      } else {
        wFlag = false;
      }
    }
  }

  const snapShot = countSides;

  // Scan per rows
  // Scan per column
  const sortedKeysRows = [...perimetersByCoordinate.keys()].toSorted(
    (coordStrA, coordStrB) => {
      const { col: colA, row: rowA } = destringifyCoord(coordStrA);
      const { col: colB, row: rowB } = destringifyCoord(coordStrB);
      return colA - colB || rowA - rowB;
    }
  );

  const groupedByRow = sortedKeysRows.reduce((acc, curr) => {
    const { row: rowA } = destringifyCoord(curr);
    acc[rowA] = acc[rowA] || [];
    acc[rowA].push(curr);
    return acc;
  }, {} as Record<string, string[]>);

  // Fill gaps in the groups
  for (const rowKey of Object.keys(groupedByRow) as string[]) {
    const row = groupedByRow[rowKey];
    const startingCol = destringifyCoord(row[0]).col;
    const endingCol = destringifyCoord(row[row.length - 1]).col;

    for (let i = startingCol; i < endingCol; i++) {
      const coord = stringifyCoord({ col: i, row: parseInt(rowKey) });
      // console.log(coord);
      if (!groupedByRow[rowKey].includes(coord)) {
        groupedByRow[rowKey].push(coord);
      }
    }

    groupedByRow[rowKey].sort((coordStrA, coordStrB) => {
      const { col: colA, row: rowA } = destringifyCoord(coordStrA);
      const { col: colB, row: rowB } = destringifyCoord(coordStrB);
      return colA - colB || rowA - rowB;
    });
  }

  let nFlag = false;
  let sFlag = false;
  // let currentCol = 0;
  for (const [row, coordinates] of Object.entries(groupedByRow)) {
    // if (currentCol !== destringifyCoord(sortedKeyCol).col) {
    // currentCol = destringifyCoord(sortedKeyCol).col;
    // console.log(currentCol);
    // console.log(countSides);
    // }

    const currentPerimetersRow = coordinates.map(
      (c) => perimetersByCoordinate.get(c) || []
    )!;

    for (const currentPerimeters of currentPerimetersRow) {
      // Keep track of consecutive E and Ws
      if (currentPerimeters.includes(Direction.N)) {
        if (!nFlag) {
          countSides++;
        }
        nFlag = true;
      } else {
        nFlag = false;
      }

      if (currentPerimeters.includes(Direction.S)) {
        if (!sFlag) {
          countSides++;
        }
        sFlag = true;
      } else {
        sFlag = false;
      }
    }
  }

  // console.log("countSides rows:", countSides - snapShot);
  // console.log("countSides cols:", snapShot);

  // console.log("countSides:", countSides);
  // console.log(sortedKeysCols);

  return countSides;
};

// const scanRegionSides = (region: HashSet<Coordinate>, shouldPrint = false) => {
//   const board = new Board(".".repeat(155 * 155), 155, 155);

// for (const coordStr of region.list()) {
//   const coord = destringifyCoord(coordStr);
//   // Offset all by SE so that I can wrap around the region
//   board.setCell("X", addCoordinates(coord, relativeCoords.SE));
// }

//   // console.log(board.toString());

//   if (region.size === 1) {
//     return 4;
//   }

//   let firstX = undefined as Coordinate | undefined;
//   const toCheck = new HashSet<Coordinate>(stringifyCoord);

//   board.iterateOver("X", (coord) => {
//     // For every empty neighbour to the left,
//     // start a walk to measure sides
//     if (firstX === undefined) {
//       firstX = coord;
//     }

//     const cellToLeft = addCoordinates(coord, relativeCoords.W);
//     if (board.safeGetCell(cellToLeft) === ".") {
//       toCheck.include(cellToLeft);
//     }
//   });

//   let turnCount = 0;

//   while (toCheck.size > 0) {
//     const currentlyChecking = destringifyCoord(toCheck.list()[0]);
//     toCheck.remove(currentlyChecking);

//     const pawn = new Pawn(board, currentlyChecking);

//     const pawnPath = new HashSet<{
//       coord: Coordinate;
//       dir: Direction;
//       lastPosition: Coordinate | undefined;
//     }>(
//       ({ coord, dir, lastPosition }) =>
//         stringifyCoordDirection(coord, dir) +
//         "," +
//         (lastPosition ? stringifyCoord(lastPosition) : "und")
//     );

//     while (true) {
//       toCheck.remove(pawn.currentPosition);

//       if (
//         pawnPath.contains({
//           coord: pawn.currentPosition,
//           dir: pawn.currentDirection,
//           lastPosition: pawn.lastPosition,
//         })
//       ) {
//         break;
//       }

//       pawnPath.include({
//         coord: pawn.currentPosition,
//         dir: pawn.currentDirection,
//         lastPosition: pawn.lastPosition,
//       });

//       // console.log("current pawn sit:");
//       // console.log(pawn.currentPosition, pawn.currentDirection);

//       /**
//        * ^ .
//        *   X
//        */
//       if (
//         board.safeGetCell(
//           addCoordinates(
//             pawn.currentPosition,
//             relativeCoords[turn90DegreesClockWise(pawn.currentDirection)]
//           )
//         ) === Spaces.OPEN &&
//         board.safeGetCell(
//           addCoordinates(
//             pawn.currentPosition,
//             relativeCoords[
//               turn90DegreesClockWise(
//                 turn45DegreesClockWise(pawn.currentDirection)
//               )
//             ]
//           )
//         ) === Spaces.WALL &&
//         // Do not return if space to right is last position
//         !equalCoordinates(
//           pawn.lastPosition!,
//           addCoordinates(
//             pawn.currentPosition,
//             relativeCoords[turn90DegreesClockWise(pawn.currentDirection)]
//           )
//         )
//       ) {
//         pawn.currentDirection = turn90DegreesClockWise(pawn.currentDirection);
//         turnCount++;
//         continue;
//       }

//       /**
//        * X
//        * ^ X
//        */
//       if (
//         board.safeGetCell(
//           addCoordinates(
//             pawn.currentPosition,
//             relativeCoords[turn90DegreesClockWise(pawn.currentDirection)]
//           )
//         ) === Spaces.WALL &&
//         board.safeGetCell(
//           addCoordinates(
//             pawn.currentPosition,
//             relativeCoords[pawn.currentDirection]
//           )
//         ) === Spaces.WALL
//       ) {
//         pawn.currentDirection = turn90DegreesCounterClockwise(
//           pawn.currentDirection
//         );
//         turnCount++;
//         continue;
//       }

//       // In the other cases, we're just moving forward
//       pawn.setCurrentPosition(
//         addCoordinates(
//           pawn.currentPosition,
//           relativeCoords[pawn.currentDirection]
//         )
//       );
//     }
//   }
//   return turnCount;
// };
// // Start doing the walk where we hug wall
// // We follow the wall on the right hand side, starting to walk up
// const { newDirection, newPosition } = pawn.conditionalNextStepV2(
//   ({ currentCoordinate, currentDirection, potentialCoordinates }) => {
//     // console.log("potentialCoordinates", potentialCoordinates);
//     const [left, middle, right, reverse] = potentialCoordinates;

//     // .L
//     // ^.

//     // .
//     // ^.
//     // .|-

//     // Turn to right
//     if (right.value === ".") {
//       // Add to turnCount
//       return {
//         newPosition: currentCoordinate,
//         newDirection: turn90DegreesClockWise(currentDirection),
//       };
//     }

//     // Move forward to middle
//     if (middle.value === ".") {
//       return {
//         newPosition: middle.coord,
//         newDirection: currentDirection,
//       };
//     }

//     // Turn to the left
//     return {
//       newPosition: currentCoordinate,
//       newDirection: turn90DegreesCounterClockwise(currentDirection),
//     };
//   },
//   ({ currentPos, currentDir }) => {
//     const relativeDirections = [
//       turn90DegreesCounterClockwise(currentDir),
//       currentDir,
//       turn90DegreesClockWise(currentDir),
//       turn90DegreesClockWise(turn90DegreesClockWise(currentDir)),
//     ];
//     return relativeDirections.map((dir) =>
//       addCoordinates(relativeCoords[dir], currentPos)
//     );
//   }
// );

// toCheck.remove(newPosition);
// if (pawnPath.contains({ coord: newPosition, dir: newDirection })) {
//   break;
// }

// pawnPath.include({ coord: newPosition, dir: newDirection });
// }
// console.log(pawnPath.list());
// }

// return 0;
// };

// let amountSides = 0;

// const pawn = new Pawn(board, firstX!);

// const pawnRoute = new HashSet<{ coord: Coordinate; dir: Direction }>(
//   ({ coord, dir }) => stringifyCoordDirection(coord, dir)
// );
// let currentDirection = Direction.E;

// while (true) {
//   const hasTakenStep = pawn.conditionalNextStep((nextCoord, nextValue) => {
//     // console.log(pawn.currentPosition, currentDirection);

//     if (nextValue === "X") {
//       return currentDirection;
//     }

//     // If our tile to the left is an X, we can turn left
//     if (
//       board.safeGetCell(
//         addCoordinates(
//           pawn.currentPosition,
//           relativeCoords[turn90DegreesCounterClockwise(currentDirection)]
//         )
//       ) === "X"
//     ) {
//       shouldPrint && console.log("TURNING when seeing X to left");
//       shouldPrint && console.log(pawn.currentPosition, currentDirection);
//       currentDirection = turn90DegreesCounterClockwise(currentDirection);
//       amountSides++;
//       return currentDirection;
//     }

//     if (nextValue === ".") {
//       shouldPrint && console.log("TURNING when seeing open spot");
//       shouldPrint && console.log(pawn.currentPosition, currentDirection);
//       currentDirection = turn90DegreesClockWise(currentDirection);

//       if (
//         !pawnRoute.contains({
//           coord: pawn.currentPosition,
//           dir: currentDirection,
//         })
//       ) {
//         amountSides++;
//       }

//       return currentDirection;
//     }

//     return currentDirection;
//   }, currentDirection);

//   // pawn about to go out of bounds
//   if (!hasTakenStep) {
//     amountSides++;
//     currentDirection = turn90DegreesClockWise(currentDirection);
//   }

//   if (
//     pawnRoute.contains({ coord: pawn.currentPosition, dir: currentDirection })
//   ) {
//     break;
//   }
//   pawnRoute.include({ coord: pawn.currentPosition, dir: currentDirection });
// }

// console.log(pawnRoute.list());

// // We're coming in from the West, so we need another turn to account for that
// if (currentDirection === Direction.W) {
//   amountSides += 2;
// } else {
//   amountSides++;
// }

// return amountSides;
// };
