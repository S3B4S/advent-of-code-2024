import { BidirectionalMap } from "../utils/bidirectionalMap.ts";
import { addCoordinates, Coordinate, relativeCoords } from "../utils/board.ts";
import { Direction } from "../utils/board.ts";
import { Board } from "../utils/board.ts";

const turn90Degrees = (direction: Direction): Direction => {
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

const turn90DegreesCounterClockwise = (direction: Direction): Direction => {
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

export const coordsBetween = (
  coordA: Coordinate,
  coordB: Coordinate
): Coordinate[] => {
  let result = [];
  if (coordA.row === coordB.row) {
    const [min, max] =
      coordA.col < coordB.col ? [coordA, coordB] : [coordB, coordA];
    for (let i = min.col + 1; i < max.col; i++) {
      result.push({ row: min.row, col: i });
    }
  }

  if (coordA.col === coordB.col) {
    const [min, max] =
      coordA.row < coordB.row ? [coordA, coordB] : [coordB, coordA];
    for (let i = min.row + 1; i < max.row; i++) {
      result.push({ row: i, col: min.col });
    }
  }

  return result;
};

const stringifyCoord = (coord: Coordinate) =>
  String(coord.col) + "," + String(coord.row);

const stringifyCoordDirection = (coord: Coordinate, direction: Direction) =>
  String(coord.col) + "," + String(coord.row) + "," + String(direction);

/**
 * Might want to test
 * @param startingPoint
 * @param direction
 * @param hashmapCols
 * @param hashmapRows
 * @returns
 */
const willFace = (
  startingPoint: Coordinate,
  direction: Direction,
  hashmapColsSorted: Record<number, Coordinate[]>,
  hashmapRowsSorted: Record<number, Coordinate[]>
): Coordinate | undefined => {
  if (direction === Direction.N) {
    const obstaclesInColumn = hashmapColsSorted[startingPoint.col];
    if (!obstaclesInColumn) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    let curr = undefined;
    for (const obstacle of obstaclesInColumn) {
      if (obstacle.row > startingPoint.row) {
        break;
      }
      curr = obstacle;
    }

    return curr;
  }

  if (direction === Direction.S) {
    const obstaclesInColumn = hashmapColsSorted[startingPoint.col];
    if (!obstaclesInColumn) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    for (const obstacle of obstaclesInColumn) {
      if (obstacle.row > startingPoint.row) {
        return obstacle;
      }
    }

    return undefined;
  }

  if (direction === Direction.E) {
    const obstaclesInRow = hashmapRowsSorted[startingPoint.row];
    if (!obstaclesInRow) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    for (const obstacle of obstaclesInRow) {
      if (obstacle.col > startingPoint.col) {
        return obstacle;
      }
    }

    return undefined;
  }

  if (direction === Direction.W) {
    const obstaclesInRow = hashmapRowsSorted[startingPoint.row];
    if (!obstaclesInRow) return;

    // Now we have the same situation as a dot in the middle of a range of numbers, and need to find the "next" one
    // We want to find the biggest, but not bigger than startingPoint.row
    let curr = undefined;
    for (const obstacle of obstaclesInRow) {
      if (obstacle.col > startingPoint.col) {
        break;
      }
      curr = obstacle;
    }

    return curr;
  }
};

export const solvePart1 = (input: string) => {
  const lines = input.trim().split("\n");
  const height = lines.length;
  const width = lines[0].length;

  const asString = input.replaceAll("\n", "");

  const board = new Board(
    asString,
    width,
    new BidirectionalMap<string, number>({
      "^": 1,
      "#": 2,
    })
  );

  const hashmapColsSorted: Record<number, Coordinate[]> = {};
  const hashmapRowsSorted: Record<number, Coordinate[]> = {};

  board.iterateOver("#", (coord) => {
    if (!hashmapColsSorted[coord.col]) hashmapColsSorted[coord.col] = [];
    hashmapColsSorted[coord.col].push(coord);

    if (!hashmapRowsSorted[coord.row]) hashmapRowsSorted[coord.row] = [];
    hashmapRowsSorted[coord.row].push(coord);
  });

  for (const keyC of Object.keys(hashmapColsSorted)) {
    hashmapColsSorted[Number(keyC)].sort((a, b) => a.row - b.row);
  }

  for (const keyC of Object.keys(hashmapRowsSorted)) {
    hashmapRowsSorted[Number(keyC)].sort((a, b) => a.col - b.col);
  }

  const hashMapVisited: Record<string, Coordinate> = {};

  board.iterateOver("^", (coord) => {
    let currentPosition = { ...coord };
    let currentDirection = Direction.N;

    hashMapVisited[stringifyCoord(currentPosition)] = currentPosition;

    while (true) {
      const nextObject = willFace(
        currentPosition,
        currentDirection,
        hashmapColsSorted,
        hashmapRowsSorted
      );

      if (!nextObject) {
        // If we're gonna leave the map, just need to find the last positions explicitly

        if (Direction.N === currentDirection) {
          for (
            let currentRow = currentPosition.row;
            currentRow >= 0;
            currentRow--
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentRow, col: currentPosition.col })
            ] = { row: currentRow, col: currentPosition.col };
          }
        }
        if (Direction.S === currentDirection) {
          for (
            let currentRow = currentPosition.row;
            currentRow < height;
            currentRow++
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentRow, col: currentPosition.col })
            ] = { row: currentRow, col: currentPosition.col };
          }
        }
        if (Direction.E === currentDirection) {
          for (
            let currentCol = currentPosition.col;
            currentCol < width;
            currentCol++
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentPosition.row, col: currentCol })
            ] = { row: currentPosition.row, col: currentCol };
          }
        }
        if (Direction.W === currentDirection) {
          for (
            let currentCol = currentPosition.col;
            currentCol >= 0;
            currentCol--
          ) {
            hashMapVisited[
              stringifyCoord({ row: currentPosition.row, col: currentCol })
            ] = { row: currentPosition.row, col: currentCol };
          }
        }

        return;
      }

      const inBetweens = coordsBetween(currentPosition, nextObject);
      for (const inBetween of inBetweens) {
        hashMapVisited[stringifyCoord(inBetween)] = inBetween;
      }

      // There must always be some space in between
      if (Direction.N === currentDirection) {
        currentPosition = { col: nextObject.col, row: nextObject.row + 1 };
      } else if (Direction.E === currentDirection) {
        currentPosition = { col: nextObject.col - 1, row: nextObject.row };
      } else if (Direction.S === currentDirection) {
        currentPosition = { col: nextObject.col, row: nextObject.row - 1 };
      } else if (Direction.W === currentDirection) {
        currentPosition = { col: nextObject.col + 1, row: nextObject.row };
      }
      currentDirection = turn90Degrees(currentDirection);
    }
  });

  return Object.keys(hashMapVisited).length;
};

export const solvePart2 = (input: string) => {
  const lines = input.trim().split("\n");
  const height = lines.length;
  const width = lines[0].length;

  const asString = input.replaceAll("\n", "");

  const board = new Board(
    asString,
    width,
    new BidirectionalMap<string, number>({
      "^": 1,
      "#": 2,
    })
  );

  const hashmapObstacles: Record<string, Coordinate> = {};

  const hashmapColsSorted: Record<number, Coordinate[]> = {};
  const hashmapRowsSorted: Record<number, Coordinate[]> = {};

  board.iterateOver("#", (coord) => {
    hashmapObstacles[stringifyCoord(coord)] = coord;

    if (!hashmapColsSorted[coord.col]) hashmapColsSorted[coord.col] = [];
    hashmapColsSorted[coord.col].push(coord);

    if (!hashmapRowsSorted[coord.row]) hashmapRowsSorted[coord.row] = [];
    hashmapRowsSorted[coord.row].push(coord);
  });

  for (const keyC of Object.keys(hashmapColsSorted)) {
    hashmapColsSorted[Number(keyC)].sort((a, b) => a.row - b.row);
  }

  for (const keyC of Object.keys(hashmapRowsSorted)) {
    hashmapRowsSorted[Number(keyC)].sort((a, b) => a.col - b.col);
  }

  const hashMapVisited: Record<
    string,
    { coord: Coordinate; dir: Direction; stepCount: number }
  > = {};
  const hashMapTurningpoints: Record<
    string,
    { coord: Coordinate; dir: Direction; stepCount: number }
  > = {};

  let stepCount = 0;
  board.iterateOver("^", (coord) => {
    let currentPosition = { ...coord };
    let currentDirection = Direction.N;

    hashMapVisited[stringifyCoordDirection(currentPosition, currentDirection)] =
      {
        coord: currentPosition,
        dir: currentDirection,
        stepCount: stepCount,
      };
    stepCount++;

    while (true) {
      if (
        // Not the start
        !(
          currentPosition.col === coord.col && currentPosition.row === coord.row
        )
      ) {
        hashMapTurningpoints[
          stringifyCoordDirection(currentPosition, currentDirection)
        ] = {
          coord: currentPosition,
          dir: currentDirection,
          stepCount: stepCount++,
        };
        // Remove turning points from visited
        // console.log("removing turning point from visited!");
        // console.log(stringifyCoordDirection(currentPosition, currentDirection));
        delete hashMapVisited[
          stringifyCoordDirection(currentPosition, Direction.N)
        ];
        delete hashMapVisited[
          stringifyCoordDirection(currentPosition, Direction.E)
        ];
        delete hashMapVisited[
          stringifyCoordDirection(currentPosition, Direction.S)
        ];
        delete hashMapVisited[
          stringifyCoordDirection(currentPosition, Direction.W)
        ];
      }

      const nextObject = willFace(
        currentPosition,
        currentDirection,
        hashmapColsSorted,
        hashmapRowsSorted
      );

      if (!nextObject) {
        // If we're gonna leave the map, just need to find the last positions explicitly

        if (Direction.N === currentDirection) {
          for (
            let currentRow = currentPosition.row;
            currentRow >= 0;
            currentRow--
          ) {
            hashMapVisited[
              stringifyCoordDirection(
                { row: currentRow, col: currentPosition.col },
                currentDirection
              )
            ] = {
              coord: { row: currentRow, col: currentPosition.col },
              dir: currentDirection,
              stepCount: stepCount++,
            };
          }
        }
        if (Direction.S === currentDirection) {
          for (
            let currentRow = currentPosition.row;
            currentRow < height;
            currentRow++
          ) {
            hashMapVisited[
              stringifyCoordDirection(
                { row: currentRow, col: currentPosition.col },
                currentDirection
              )
            ] = {
              coord: { row: currentRow, col: currentPosition.col },
              dir: currentDirection,
              stepCount: stepCount++,
            };
          }
        }
        if (Direction.E === currentDirection) {
          for (
            let currentCol = currentPosition.col;
            currentCol < width;
            currentCol++
          ) {
            hashMapVisited[
              stringifyCoordDirection(
                { row: currentPosition.row, col: currentCol },
                currentDirection
              )
            ] = {
              coord: { row: currentPosition.row, col: currentCol },
              dir: currentDirection,
              stepCount: stepCount++,
            };
          }
        }
        if (Direction.W === currentDirection) {
          for (
            let currentCol = currentPosition.col;
            currentCol >= 0;
            currentCol--
          ) {
            hashMapVisited[
              stringifyCoordDirection(
                { row: currentPosition.row, col: currentCol },
                currentDirection
              )
            ] = {
              coord: { row: currentPosition.row, col: currentCol },
              dir: currentDirection,
              stepCount: stepCount++,
            };
          }
        }

        return;
      }

      const inBetweens = coordsBetween(currentPosition, nextObject);
      for (const inBetween of inBetweens) {
        hashMapVisited[stringifyCoordDirection(inBetween, currentDirection)] = {
          coord: inBetween,
          dir: currentDirection,
          stepCount: stepCount++,
        };
      }

      // There must always be some space in between
      if (Direction.N === currentDirection) {
        currentPosition = { col: nextObject.col, row: nextObject.row + 1 };
      } else if (Direction.E === currentDirection) {
        currentPosition = { col: nextObject.col - 1, row: nextObject.row };
      } else if (Direction.S === currentDirection) {
        currentPosition = { col: nextObject.col, row: nextObject.row - 1 };
      } else if (Direction.W === currentDirection) {
        currentPosition = { col: nextObject.col + 1, row: nextObject.row };
      }
      currentDirection = turn90Degrees(currentDirection);
    }
  });

  // for (const vals of Object.values(hashMapTurningpoints)) {
  //   board.setCell(8, vals.coord);
  // }
  // console.log(
  //   board.toString(
  //     new BidirectionalMap({
  //       ".": 0,
  //       "+": 8,
  //       "#": 2,
  //     })
  //   )
  // );
  // console.log(hashMapTurningpoints);

  // Add step count
  // if step count of path > then turning point, we can add it to list

  const obstaclesPlacedHashmap: Record<string, Coordinate> = {};
  // let count = 0;

  // console.log(hashMapTurningpoints);
  // console.log(hashMapVisited);

  // From start, only look at other turning points
  // Only consider start without any walls around
  board.iterateOver("^", (coord) => {
    const currentPosition = { ...coord };

    // Going eastwards
    for (let step = currentPosition.col + 1; step < width; step++) {
      const currStep = { col: step, row: currentPosition.row };

      if (hashmapObstacles[stringifyCoord(currStep)]) {
        break;
      }

      if (
        hashMapTurningpoints[stringifyCoordDirection(currStep, Direction.W)]
      ) {
        const pos = addCoordinates(coord, relativeCoords.W);
        obstaclesPlacedHashmap[stringifyCoord(pos)] = pos;
      }
    }
  });

  // console.log(count);

  // console.log(hashMapVisited);

  // Then hereafter, for every turning point, see how many visited paths you come across (ignoring start)
  // let subCount = 0;

  for (const vals of Object.values(hashMapTurningpoints)) {
    const turnRight = turn90Degrees(vals.dir);

    if (turnRight === Direction.N) {
      for (let step = vals.coord.row - 1; step >= 0; step--) {
        if (
          hashmapObstacles[stringifyCoord({ col: vals.coord.col, row: step })]
        )
          break;

        // Stop at objects!
        const currStep =
          hashMapVisited[
            stringifyCoordDirection(
              { col: vals.coord.col, row: step },
              Direction.E
            )
          ];
        if (
          currStep?.dir === Direction.E &&
          currStep.stepCount > vals.stepCount
        ) {
          // console.log(turnRight, vals, currStep);

          const obstaclePlaced = addCoordinates(
            currStep.coord,
            relativeCoords.E
          );
          obstaclesPlacedHashmap[stringifyCoord(obstaclePlaced)] =
            obstaclePlaced;
        }
      }
    }

    if (turnRight === Direction.S) {
      for (let step = vals.coord.row + 1; step < height; step++) {
        if (
          hashmapObstacles[stringifyCoord({ col: vals.coord.col, row: step })]
        )
          break;

        const currStep =
          hashMapVisited[
            stringifyCoordDirection(
              { col: vals.coord.col, row: step },
              Direction.W
            )
          ];
        if (
          currStep?.dir === Direction.W &&
          currStep.stepCount > vals.stepCount
        ) {
          // console.log(turnRight, vals, currStep);
          const obstaclePlaced = addCoordinates(
            currStep.coord,
            relativeCoords.W
          );
          obstaclesPlacedHashmap[stringifyCoord(obstaclePlaced)] =
            obstaclePlaced;
        }
      }
    }

    if (turnRight === Direction.E) {
      for (let step = vals.coord.col + 1; step < width; step++) {
        if (
          hashmapObstacles[stringifyCoord({ col: step, row: vals.coord.row })]
        )
          break;

        const currStep =
          hashMapVisited[
            stringifyCoordDirection(
              { col: step, row: vals.coord.row },
              Direction.S
            )
          ];
        if (
          currStep?.dir === Direction.S &&
          currStep.stepCount > vals.stepCount
        ) {
          // console.log(turnRight, vals, currStep);
          const obstaclePlaced = addCoordinates(
            currStep.coord,
            relativeCoords.S
          );
          obstaclesPlacedHashmap[stringifyCoord(obstaclePlaced)] =
            obstaclePlaced;
        }
      }
    }

    if (turnRight === Direction.W) {
      for (let step = vals.coord.col - 1; step >= 0; step--) {
        if (
          hashmapObstacles[stringifyCoord({ col: step, row: vals.coord.row })]
        )
          break;

        const currStep =
          hashMapVisited[
            stringifyCoordDirection(
              { col: step, row: vals.coord.row },
              Direction.N
            )
          ];
        if (
          currStep?.dir === Direction.N &&
          currStep.stepCount > vals.stepCount
        ) {
          // console.log(turnRight, vals, currStep);
          const obstaclePlaced = addCoordinates(
            currStep.coord,
            relativeCoords.N
          );
          obstaclesPlacedHashmap[stringifyCoord(obstaclePlaced)] =
            obstaclePlaced;
        }
      }
    }
  }

  // for (const obst of Object.values(obstaclesPlacedHashmap)) {
  //   board.setCell(9, obst);
  //   console.log(
  //     board.toString(new BidirectionalMap({ ".": 0, "#": 2, O: 9, "^": 1 }))
  //   );
  //   board.setCell(0, obst);
  // }

  return Object.keys(obstaclesPlacedHashmap).length;
};
