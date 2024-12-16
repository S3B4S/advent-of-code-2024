import {
  Coordinate,
  stringifyCoordDirection,
  turn180Degrees,
  turn90DegreesClockWise,
  turn90DegreesCounterClockwise,
  destringifyCoordDirection,
} from "../utils/board.ts";
import { equalCoordinates } from "../utils/board.ts";
import { stringifyCoord } from "../utils/board.ts";
import { Board, Direction } from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { zip } from "../utils/list.ts";

export const solvePart1 = (input: string) => {
  const board = Board.fromUnparsedBoard(input);

  const start = board.getPositionsByKey("S")[0];
  const end = board.getPositionsByKey("E")[0];

  const graph = constructDirectedWeightedGraph(board, start);
  const result = dijkstra(graph, start, end);

  return result;
};

const plusDirections = [Direction.N, Direction.E, Direction.S, Direction.W];

const dijkstra = (
  graph: Record<string, Record<string, number>>,
  start: Coordinate,
  end: Coordinate
) => {
  const queue = [] as { coord: Coordinate; dir: Direction }[];
  queue.push({ coord: start, dir: Direction.E });

  const mem = {} as Record<string, { cost: number; lastNode: string }>;

  mem[stringifyCoordDirection(start, Direction.E)] = {
    cost: 0,
    lastNode: stringifyCoordDirection(start, Direction.E),
  };

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    const currentNodeKey = stringifyCoordDirection(
      currentNode.coord,
      currentNode.dir
    );

    for (const [neighbour, cost] of Object.entries(graph[currentNodeKey])) {
      mem[neighbour] = {
        cost: mem[neighbour]?.cost || Infinity,
        lastNode: mem[neighbour]?.lastNode || currentNodeKey,
      };

      const newCost = mem[currentNodeKey].cost + cost;

      if (newCost < mem[neighbour].cost) {
        mem[neighbour].cost = newCost;
        mem[neighbour].lastNode = currentNodeKey;

        const { col, row, direction } = destringifyCoordDirection(neighbour);
        queue.push({
          coord: { col, row },
          dir: direction,
        });
      }
    }
  }

  const res = plusDirections.reduce((acc, dir) => {
    return Math.min(
      acc,
      mem[stringifyCoordDirection(end, dir)]?.cost || Infinity
    );
  }, Infinity);

  return res;
};

/**
 * Given an object which has coords and directions stringifed, return all the coords
 * @param mem
 * @returns
 */
const getAllCoords = (
  mem: Record<string, { cost: number; lastNodes: string[] }>,
  coord: Coordinate
) => {
  return plusDirections.flatMap((dir) => {
    const key = stringifyCoordDirection(coord, dir);
    if (mem[key]) {
      return key;
    }
    return [];
  });
};

const traverseBackwardsForPaths = (
  mem: Record<string, { cost: number; lastNodes: string[] }>,
  start: Coordinate,
  end: Coordinate,
  lowestCostToEnd: number
) => {
  const allEnds = getAllCoords(mem, end)
    .filter((x) => mem[x].cost === lowestCostToEnd)
    .map((stringifiedCoordDir) =>
      destringifyCoordDirection(stringifiedCoordDir)
    );

  // console.log(mem);

  const allTiles = new HashSet<Coordinate>(stringifyCoord);

  for (const end of allEnds) {
    const queue = [] as { coord: Coordinate; dir: Direction }[];
    queue.push({ coord: { col: end.col, row: end.row }, dir: end.direction });

    const visited = new HashSet<{ dir: Direction; coord: Coordinate }>(
      ({ dir, coord }) => stringifyCoordDirection(coord, dir)
    );

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      // console.log("--------");
      // console.log(
      //   "currentNode",
      //   currentNode,
      //   stringifyCoordDirection(currentNode.coord, currentNode.dir)
      // );
      const memKey = stringifyCoordDirection(
        currentNode.coord,
        currentNode.dir
      );

      // console.log("mem[memKey]", mem[memKey]);
      const nextNodes = mem[memKey].lastNodes;

      for (const nextNode of nextNodes) {
        const { col, row, direction } = destringifyCoordDirection(nextNode);
        if (!visited.contains({ coord: { col, row }, dir: direction })) {
          visited.include({ coord: { col, row }, dir: direction });
          queue.push({ coord: { col, row }, dir: direction });
        }
      }
      // console.log("queue", queue);
    }

    visited.list().map((x) => {
      const { col, row } = destringifyCoordDirection(x);
      allTiles.include({ col, row });
    });
  }

  return allTiles.list();
};

/**
 * Works same as dijkstra, but it returns all the best possible paths that have the same cost
 * @param graph
 * @param start
 * @param end
 * @returns
 */
const dijkstraMultiplePaths = (
  graph: Record<string, Record<string, number>>,
  start: Coordinate,
  end: Coordinate
) => {
  const queue = [] as { coord: Coordinate; dir: Direction }[];
  queue.push({ coord: start, dir: Direction.E });

  const mem = {} as Record<string, { cost: number; lastNodes: string[] }>;

  mem[stringifyCoordDirection(start, Direction.E)] = {
    cost: 0,
    lastNodes: [stringifyCoordDirection(start, Direction.E)],
  };

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    const currentNodeKey = stringifyCoordDirection(
      currentNode.coord,
      currentNode.dir
    );

    for (const [neighbour, cost] of Object.entries(graph[currentNodeKey])) {
      mem[neighbour] = {
        cost: mem[neighbour]?.cost || Infinity,
        lastNodes: mem[neighbour]?.lastNodes || currentNodeKey,
      };

      const newCost = mem[currentNodeKey].cost + cost;

      if (newCost > mem[neighbour].cost) {
        continue;
      }

      if (newCost === mem[neighbour].cost) {
        if (!mem[neighbour].lastNodes.includes(currentNodeKey)) {
          mem[neighbour].lastNodes.push(currentNodeKey);
        }
      } else if (newCost < mem[neighbour].cost) {
        mem[neighbour].cost = newCost;
        mem[neighbour].lastNodes = [currentNodeKey];
      }

      const { col, row, direction } = destringifyCoordDirection(neighbour);
      queue.push({
        coord: { col, row },
        dir: direction,
      });
    }
  }

  const lowestCostToEnd = plusDirections.reduce((acc, dir) => {
    return Math.min(
      acc,
      mem[stringifyCoordDirection(end, dir)]?.cost || Infinity
    );
  }, Infinity);

  return {
    mem,
    lowestCostToEnd,
  };
};

/**
 * Every empty space gets turned into a maximum of 4 nodes, each indicating a different incoming direction
 * @param board
 */
const constructDirectedWeightedGraph = (
  board: Board<string, number>,
  start: Coordinate
) => {
  const graph = {} as Record<string, Record<string, number>>;
  graph[stringifyCoordDirection(start, Direction.E)] = {};

  const queue: { coord: Coordinate; dir: Direction }[] = [];
  queue.push({ coord: start, dir: Direction.E });

  const visited = new HashSet<{ coord: Coordinate; dir: Direction }>(
    ({ coord, dir }) => stringifyCoordDirection(coord, dir)
  );

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    visited.include(currentNode);

    for (const [neighbourDir, neighbor] of zip(
      plusDirections,
      board.getNeighbours(currentNode.coord, plusDirections)
    ) as [Direction, Coordinate][]) {
      if (
        board.safeGetCell(neighbor) !== "." &&
        board.safeGetCell(neighbor) !== "E" &&
        board.safeGetCell(neighbor) !== "S"
      )
        continue;

      // If the neighbour is in opposite direction, we are not interested in this route
      if (neighbourDir === turn180Degrees(currentNode.dir)) {
        continue;
      }

      const currentNodeKey = stringifyCoordDirection(
        currentNode.coord,
        currentNode.dir
      );
      const neighborKey = stringifyCoordDirection(neighbor, neighbourDir);

      if (!graph[neighborKey]) {
        graph[neighborKey] = {} as Record<string, number>;
      }

      let cost = 1;
      if (
        neighbourDir === turn90DegreesClockWise(currentNode.dir) ||
        neighbourDir === turn90DegreesCounterClockwise(currentNode.dir)
      ) {
        cost += 1000;
      }

      graph[currentNodeKey][neighborKey] = cost;
      if (!visited.contains({ coord: neighbor, dir: neighbourDir })) {
        queue.push({ coord: neighbor, dir: neighbourDir });
      }
    }
  }

  return graph;
};

const findPaths = (
  board: Board<string, number>,
  start: Coordinate,
  end: Coordinate
) => {
  const queue: Coordinate[] = [];
  queue.push(start);

  const mem = {} as Record<
    string,
    {
      known: boolean;
      cost: number;
      lastNode: Coordinate;
    }
  >;

  mem[stringifyCoord(start)] = {
    known: false,
    cost: 0,
    lastNode: start,
  };
  // const visited = new HashSet<Coordinate>(stringifyCoord);
  // visited.include(start);

  const finalPaths: Coordinate[][] = [];

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    mem[stringifyCoord(currentNode)] = {
      known: true,
      cost: mem[stringifyCoord(currentNode)].cost + 1,
      lastNode: currentNode,
    };

    // const log = (msg: unknown) => {
    //   if (currentPath.path.find((c) => c.col === 10 && c.row === 7)) {
    //     console.log("cond log:", msg);
    //   }
    // };
    // const lastNode = currentPath.path[currentPath.path.length - 1];

    // log(currentPath);
    // log(lastNode);

    // if (equalCoordinates(currentNode, end)) {
    // log("pushing to final !!!!!");
    // log(finalPaths);
    // finalPaths.push(currentPath.path);
    // continue;
    // return currentPath;
    // }

    for (const neighbor of board.getNeighbours(currentNode, [
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

      // console.log(currentNode);
      // if (!currentNode.contains(neighbor)) {
      // if (lastNode.col === 9 && lastNode.row === 7) {
      // console.log("9,7 nb:", neighbor);
      // }

      // Do not add the end coordinate to visited
      // Might want to keep track of visited per path
      // if (!equalCoordinates(neighbor, end))
      // currentPath.visited.include(neighbor);

      queue.push(neighbor);
      // if (lastNode.col === 9 && lastNode.row === 7) {
      // console.log("9,7 queue:", queue);
      // }
      // }
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
  const board = Board.fromUnparsedBoard(input);

  const start = board.getPositionsByKey("S")[0];
  const end = board.getPositionsByKey("E")[0];

  const graph = constructDirectedWeightedGraph(board, start);
  const { lowestCostToEnd, mem: dijkstraGraph } = dijkstraMultiplePaths(
    graph,
    start,
    end
  );
  const allTiles = traverseBackwardsForPaths(
    dijkstraGraph,
    start,
    end,
    lowestCostToEnd
  );
  return allTiles.length + 1;
};
