import {
  Coordinate,
  equalCoordinates,
  stringifyCoord,
} from "../utils/board.ts";

const Regex = {
  A: /Button A: X\+(\d+), Y\+(\d+)/,
  B: /Button B: X\+(\d+), Y\+(\d+)/,
  Prize: /Prize: X\=(\d+), Y\=(\d+)/,
};

const Tokens = {
  A: 3,
  B: 1,
};

type Machine = {
  a: {
    x: number;
    y: number;
  };
  b: {
    x: number;
    y: number;
  };
  prize: {
    x: number;
    y: number;
  };
};

export const solvePart1 = (input: string) => {
  const machines = input
    .trim()
    .split("\n\n")
    .map((machine) => {
      const [a, b, prize] = machine.split("\n");
      const [aX, aY] = [a.match(Regex.A)?.[1], a.match(Regex.A)?.[2]];
      const [bX, bY] = [b.match(Regex.B)?.[1], b.match(Regex.B)?.[2]];
      const [prizeX, prizeY] = [
        prize.match(Regex.Prize)?.[1],
        prize.match(Regex.Prize)?.[2],
      ];

      return {
        a: {
          x: Number(aX),
          y: Number(aY),
        },
        b: {
          x: Number(bX),
          y: Number(bY),
        },
        prize: {
          x: Number(prizeX),
          y: Number(prizeY),
        },
      };
    });

  let outcome = 0;
  // console.log(machines);
  machines.forEach((machine) => {
    mem = {};
    set(mem, [0, 0], {
      col: 0,
      row: 0,
    });
    viableLocations = [];

    solveRecPart1(machine, {
      col: machine.prize.x,
      row: machine.prize.y,
    });

    const x = viableLocations.sort((a, b) => a.cost - b.cost)[0];
    if (x) {
      outcome += x.cost;
    }
  });

  return outcome;
};

const set = (
  obj: Record<string, any>,
  path: (string | number)[],
  value: any
) => {
  const [key, ...rest] = path;
  obj[key] = obj[key] || {};
  if (rest.length > 0) {
    set(obj[key], rest, value);
  } else {
    obj[key] = value;
  }
};

let mem = {} as Record<string, Record<string, Coordinate>>;

let viableLocations = [] as { coord: Coordinate; cost: number }[];

const solveRecPart1 = (machine: Machine, goal: Coordinate) => {
  for (let b = 0; b < 100; b++) {
    for (let a = 0; a < 100; a++) {
      const current = mem[a][b];

      if (!current) break;
      if (current.col > goal.col || current.row > goal.row) break;

      if (equalCoordinates(current, goal)) {
        viableLocations.push({
          coord: current,
          cost: a * Tokens.A + b * Tokens.B,
        });
      }

      if (!mem[a + 1]?.[b]) {
        // We press button A:
        set(mem, [a + 1, b], {
          col: current.col + machine.a.x,
          row: current.row + machine.a.y,
        });
      }

      // We press button B:
      if (!mem[a]?.[b + 1]) {
        set(mem, [a, b + 1], {
          col: current.col + machine.b.x,
          row: current.row + machine.b.y,
        });
      }
    }
  }
};

export const solvePart2 = (input: string) => {
  return 0;
};

const printTable = (
  table: Record<number | string, Record<number | string, Coordinate>>
) => {
  // Find min/max indices
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minCol = Infinity;
  let maxCol = -Infinity;

  Object.keys(table).forEach((row) => {
    const rowNum = Number(row);
    minRow = Math.min(minRow, rowNum);
    maxRow = Math.max(maxRow, rowNum);

    Object.keys(table[row]).forEach((col) => {
      const colNum = Number(col);
      minCol = Math.min(minCol, colNum);
      maxCol = Math.max(maxCol, colNum);
    });
  });

  // Print table
  for (let row = minRow; row <= maxRow; row++) {
    let line = "";
    for (let col = minCol; col <= maxCol; col++) {
      if (table[row]?.[col]) {
        line += ("|" + stringifyCoord(table[row][col]) + " ").padEnd(15, " ");
      } else {
        line += "|.".padEnd(15, " ");
      }
    }
    console.log(line);
  }
};
