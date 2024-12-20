import { Characters } from "../utils/board.ts";
import {
  Board,
  Coordinate,
  dpadDirections,
  StringifiedCoord,
  stringifyCoord,
  Direction,
  addDirectionToCoordinate,
  destringifyCoord,
  turn90DegreesClockWise,
  turn90DegreesCounterClockwise,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { zip } from "../utils/list.ts";

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

const constructGraph = (
  board: Board<StringifiedCoord, number>,
  start: Coordinate
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

    for (const [direction, neighbor] of zip(
      dpadDirections,
      board.getNeighbours(currentNode, dpadDirections)
    ) as [Direction, Coordinate][]) {
      // This is for cheat routes that go 2 in the same direction
      if (
        board.safeGetCell(neighbor) === Characters.HashTag &&
        board.safeGetCell(addDirectionToCoordinate(neighbor, direction)) ===
          Characters.Dot
      ) {
        // This qualifies for a cheat route
        graph[stringifyCoord(currentNode)].cheatRoutes[
          stringifyCoord(addDirectionToCoordinate(neighbor, direction))
        ] = 1;
      }

      // This is for cheat routes that take a turn clockwise
      if (
        board.safeGetCell(neighbor) === Characters.HashTag &&
        board.safeGetCell(
          addDirectionToCoordinate(neighbor, turn90DegreesClockWise(direction))
        ) === Characters.Dot
      ) {
        graph[stringifyCoord(currentNode)].cheatRoutes[
          stringifyCoord(
            addDirectionToCoordinate(
              neighbor,
              turn90DegreesClockWise(direction)
            )
          )
        ] = 1;
      }

      // This is for cheat routes that take a turn clockwise
      // if (
      //   board.safeGetCell(neighbor) === Characters.HashTag &&
      //   board.safeGetCell(
      //     addDirectionToCoordinate(
      //       neighbor,
      //       turn90DegreesCounterClockwise(direction)
      //     )
      //   ) === Characters.Dot
      // ) {
      //   graph[stringifyCoord(currentNode)].cheatRoutes[
      //     stringifyCoord(
      //       addDirectionToCoordinate(
      //         neighbor,
      //         turn90DegreesCounterClockwise(direction)
      //       )
      //     )
      //   ] = 1;
      // }

      if (board.safeGetCell(neighbor) !== ".") {
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
      const savedCost = cheatNbNode.cost - currentNode.cost - 2;

      if (savedCost <= 0) {
        continue;
      }

      if (savedCosts[savedCost] === undefined) {
        savedCosts[savedCost] = 0;
      }

      // console.log("Cheat route found!");
      // console.log(currentCoord, cheatNb, savedCost);

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

  board.setCell(".", start);
  board.setCell(".", end);

  const graph = constructGraph(board, start);
  const cheatingRoutes = calculateSavingsCheatingRoutes(graph, start);

  // console.log(graph);
  // console.log(cheatingRoutes);

  const saveAtLeast100 = Object.entries(cheatingRoutes)
    .filter(([saveAmount, _]) => Number(saveAmount) >= 100)
    .reduce((acc, [_, count]) => acc + count, 0);

  return { cheatingRoutes, saveAtLeast100 };
};

export const solvePart2 = (input: string) => {
  return 0;
};
