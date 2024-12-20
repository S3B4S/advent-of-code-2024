import { Characters } from "../utils/board.ts";
import {
  Board,
  Coordinate,
  dpadDirections,
  StringifiedCoord,
  stringifyCoord,
  destringifyCoord,
  distanceBetweenCoords,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";

const STEP_COST = 1;
type Graph = Record<
  StringifiedCoord,
  {
    cost: number;
    lastNode: StringifiedCoord;
    outgoing: Record<StringifiedCoord, number>;
    cheatRoutes: Record<StringifiedCoord, number>;
  }
>;

const constructGraphWithCheatingRoutes = (
  board: Board<StringifiedCoord, number>,
  start: Coordinate,
  cheatingRange: number = 2
) => {
  const graph = {} as Graph;

  const queue: Coordinate[] = [];
  queue.push(start);

  const visited = new HashSet<Coordinate>(stringifyCoord);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    graph[stringifyCoord(currentNode)] = {
      cost: graph[stringifyCoord(currentNode)]?.cost || 0,
      lastNode: graph[stringifyCoord(currentNode)]?.lastNode || "-1,-1",
      outgoing: graph[stringifyCoord(currentNode)]?.outgoing || {},
      cheatRoutes: graph[stringifyCoord(currentNode)]?.cheatRoutes || {},
    };
    visited.include(currentNode);

    for (const nb of board.getNeighboursv2(currentNode, cheatingRange)) {
      if (board.getCell(nb) === Characters.Dot) {
        // This qualifies for a cheat route
        graph[stringifyCoord(currentNode)].cheatRoutes[stringifyCoord(nb)] = 1;
      }
    }

    for (const neighbor of board.getNeighbours(currentNode, dpadDirections)) {
      if (board.safeGetCell(neighbor) !== Characters.Dot) {
        continue;
      }

      if (visited.contains(neighbor)) {
        continue;
      }

      graph[stringifyCoord(neighbor)] = {
        cost: graph[stringifyCoord(currentNode)].cost + STEP_COST,
        lastNode: stringifyCoord(currentNode),
        outgoing: {},
        cheatRoutes: {},
      };

      graph[stringifyCoord(currentNode)].outgoing[stringifyCoord(neighbor)] = 1;

      queue.push(neighbor);
    }
  }

  return graph;
};

const calculateSavingsCheatingRoutes = (graph: Graph, start: Coordinate) => {
  const queue: Coordinate[] = [];
  queue.push(start);

  const visited = new HashSet<Coordinate>(stringifyCoord);

  // Record<StepsSaved, NumberOfCheatRoutes>
  // { 5: 2 } => 2 cheat routes that save 5 steps
  const savedCosts = {} as Record<number, number>;

  while (queue.length > 0) {
    const currentCoord = queue.shift()!;
    visited.include(currentCoord);

    const currentNode = graph[stringifyCoord(currentCoord)];

    for (const cheatNb of Object.keys(currentNode.cheatRoutes)) {
      const cheatNbNode = graph[cheatNb];
      const savedCost =
        cheatNbNode.cost -
        currentNode.cost -
        distanceBetweenCoords(currentCoord, destringifyCoord(cheatNb));

      if (savedCost <= 0) {
        continue;
      }

      if (savedCosts[savedCost] === undefined) {
        savedCosts[savedCost] = 0;
      }

      savedCosts[savedCost]++;
    }

    for (const nb of Object.keys(currentNode.outgoing)) {
      const nbCoord = destringifyCoord(nb);
      if (visited.contains(nbCoord)) {
        continue;
      }

      queue.push(nbCoord);
    }
  }

  return savedCosts;
};

export const solvePart1 = (input: string) => {
  const board = Board.fromUnparsedBoard(input);

  const start = board.getPositionsByKey("S")[0];
  const end = board.getPositionsByKey("E")[0];

  board.setCell(Characters.Dot, start);
  board.setCell(Characters.Dot, end);

  const graph = constructGraphWithCheatingRoutes(board, start);
  const cheatingRoutes = calculateSavingsCheatingRoutes(graph, start);

  const saveAtLeast100 = Object.entries(cheatingRoutes)
    .filter(([saveAmount, _]) => Number(saveAmount) >= 100)
    .reduce((acc, [_, count]) => acc + count, 0);

  return { cheatingRoutes, saveAtLeast100 };
};

export const solvePart2 = (input: string) => {
  const board = Board.fromUnparsedBoard(input);

  const start = board.getPositionsByKey("S")[0];
  const end = board.getPositionsByKey("E")[0];

  board.setCell(Characters.Dot, start);
  board.setCell(Characters.Dot, end);

  const graph = constructGraphWithCheatingRoutes(board, start, 20);
  const cheatingRoutes = calculateSavingsCheatingRoutes(graph, start);

  const saveAtLeast100 = Object.entries(cheatingRoutes)
    .filter(([saveAmount, _]) => Number(saveAmount) >= 100)
    .reduce((acc, [_, count]) => acc + count, 0);

  const saveAtLeast50 = Object.entries(cheatingRoutes)
    .filter(([saveAmount, _]) => Number(saveAmount) >= 50)
    .reduce((acc, [_, count]) => acc + count, 0);

  return { cheatingRoutes, saveAtLeast100, saveAtLeast50 };
};
