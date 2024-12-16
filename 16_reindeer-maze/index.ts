import { Coordinate } from "../utils/board.ts";
import { equalCoordinates } from "../utils/board.ts";
import { stringifyCoord } from "../utils/board.ts";
import { Board, Direction } from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";

export const solvePart1 = (input: string) => {
  const board = Board.fromUnparsedBoard(input);

  const start = board.getPositionsByKey("S")[0];
  const end = board.getPositionsByKey("E")[0];

  // console.log(start, end);

  const paths = findPaths(board, start, end);
  // console.log(paths);

  if (paths.length === 0) return 0;

  // for (const coord of path) {
  //   board.setCell("O", coord);
  // }

  // console.log(board.toString());

  // Calculate if we need to turn at the beginning
  // const isDirectionFirstStepEast =
  //   path[0].row === path[1].row && path[0].col < path[1].col ? 1 : 0;

  let lowest = Infinity;

  for (const path of paths) {
    const { step, turn } = calculatePath(path);
    const score = step * 1 + (1 + turn) * 1000;
    lowest = Math.min(lowest, score);
  }

  return lowest;
};

const findPaths = (
  board: Board<string, number>,
  start: Coordinate,
  end: Coordinate
) => {
  // List of paths
  const queue: { path: Coordinate[]; visited: HashSet<Coordinate> }[] = [];
  queue.push({
    path: [start],
    visited: new HashSet<Coordinate>(stringifyCoord),
  });

  // const visited = new HashSet<Coordinate>(stringifyCoord);
  // visited.include(start);

  const finalPaths: Coordinate[][] = [];

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const log = (msg: unknown) => {
      if (currentPath.path.find((c) => c.col === 10 && c.row === 7)) {
        console.log("cond log:", msg);
      }
    };
    const lastNode = currentPath.path[currentPath.path.length - 1];

    // log(currentPath);
    // log(lastNode);

    if (equalCoordinates(lastNode, end)) {
      // log("pushing to final !!!!!");
      // log(finalPaths);
      finalPaths.push(currentPath.path);
      continue;
      // return currentPath;
    }

    for (const neighbor of board.getNeighbours(lastNode, [
      Direction.N,
      Direction.E,
      Direction.S,
      Direction.W,
    ])) {
      if (
        board.safeGetCell(neighbor) !== "." &&
        board.safeGetCell(neighbor) !== "E"
      )
        continue;

      console.log(currentPath.path);
      if (!currentPath.visited.contains(neighbor)) {
        // if (lastNode.col === 9 && lastNode.row === 7) {
        // console.log("9,7 nb:", neighbor);
        // }

        // Do not add the end coordinate to visited
        // Might want to keep track of visited per path
        // if (!equalCoordinates(neighbor, end))
        // currentPath.visited.include(neighbor);

        queue.push({
          path: [...currentPath.path, neighbor],
          visited: currentPath.visited,
        });
        // if (lastNode.col === 9 && lastNode.row === 7) {
        // console.log("9,7 queue:", queue);
        // }
      }
    }
  }

  return finalPaths;
};

const calculatePath = (path: Coordinate[]): { step: number; turn: number } => {
  // Whether we are traversing a column or a row
  let traversingCol = path[0].col === path[1].col;
  const count = {
    step: 0,
    turn: 0,
  };

  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const current = path[i];

    let action;
    if (traversingCol && prev.col === current.col) {
      // We are still traversing the same column
      action = "travel-same-col";
      count.step += +1;
    } else if (traversingCol && prev.row === current.row) {
      // We have taken a turn and a step
      action = "turn-from-col";
      count.turn += 1;
      count.step += 1;
      traversingCol = !traversingCol;
    } else if (!traversingCol && prev.row === current.row) {
      action = "travel-same-row";
      // We are still traversing the same row
      count.step += 1;
    } else {
      action = "turn-from-row";
      // We have taken a turn and a step
      count.turn += 1;
      count.step += 1;
      traversingCol = !traversingCol;
    }

    // console.log(prev, current, action);
  }

  return count;
};

export const solvePart2 = (input: string) => {
  return 0;
};
