import {
  Coordinate,
  Characters,
  Board,
  stringifyCoord,
  dpadDirections,
  destringifyCoord,
  equalCoordinates,
} from "../utils/board.ts";
import { HashSet } from "../utils/hashSet.ts";
import { PriorityEncodedQueue } from "../utils/encodedQueue.ts";
import { HashMap } from "../utils/hashMap.ts";

export const solvePart1 = (
  input: string,
  memorySpace: { width: number; height: number } = { width: 71, height: 71 },
  amountFalling: number = 1024
) => {
  const board = new Board(
    Characters.Dot.repeat(memorySpace.width * memorySpace.height),
    memorySpace.width,
    memorySpace.height
  );

  for (const line of input.split("\n").slice(0, amountFalling)) {
    const [x, y] = line.split(",").map((x) => Number(x));
    board.setCell(Characters.WhiteRetroBlock, { col: x, row: y });
  }
  console.log(board.toString());

  const start = { col: 0, row: 0 } satisfies Coordinate;
  const end = {
    col: memorySpace.width - 1,
    row: memorySpace.height - 1,
  } satisfies Coordinate;

  const closed = new HashSet<Coordinate>(stringifyCoord);
  const open = new PriorityEncodedQueue<Coordinate>(
    stringifyCoord,
    destringifyCoord
  );
  const mem = new HashMap<Coordinate, { cost: number; cameFrom: Coordinate }>(
    stringifyCoord
  );
  mem.set(start, { cost: 0, cameFrom: { col: -1, row: -1 } });

  open.enqueue(start, 0);

  while (!open.isEmpty()) {
    const current = open.dequeue()!;
    // console.log("----current");

    // console.log(open.list());
    closed.include(current);

    for (const nb of board.getNeighbours(current, dpadDirections)) {
      if (
        board.getCell(nb) === Characters.Dot &&
        !closed.contains(nb) &&
        !open.contains(nb)
      ) {
        const newCost = mem.get(current)!.cost + 1;
        if (newCost < (mem.get(nb)?.cost || Infinity)) {
          mem.set(nb, { cost: newCost, cameFrom: current });
          const priority = newCost + heuristic(end, nb);
          open.enqueue(nb, priority);
        }
      }
    }
  }

  if (!mem.get(end)) {
    console.error("Exit is unreachable!");
    return -1;
  }

  // Trace back path
  let count = 0;

  let current = end;
  while (!equalCoordinates(current, start)) {
    board.setCell(Characters.Star, current);
    count++;
    current = mem.get(current)!.cameFrom;
  }

  console.log(board.toString());

  return count;
};

const heuristic = (end: Coordinate, current: Coordinate) => {
  // Manhattan distance, ignoring walls
  return Math.abs(end.col - current.col) + Math.abs(end.row - current.row);
};

/**
 * @TODO Should do binary search
 */
export const solvePart2 = (
  input: string,
  memorySpace: { width: number; height: number } = { width: 71, height: 71 }
) => {
  const nBytes = input.trim().split("\n").length;
  const bytes = input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map((x) => Number(x)));

  for (let i = 0; i < nBytes; i++) {
    const result = solvePart1(input, memorySpace, i);
    if (result === -1) {
      const byte = bytes[i - 1];
      return { col: byte[0], row: byte[1] };
    }
  }

  return { col: -1, row: -1 };
};
