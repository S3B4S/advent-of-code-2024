import { Coordinate, equalCoordinates } from "../utils/board.ts";

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

export const solve = (input: string, isPart2: boolean = false) => {
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
          x: Number(prizeX) + (isPart2 ? 10000000000000 : 0),
          y: Number(prizeY) + (isPart2 ? 10000000000000 : 0),
        },
      };
    });

  let outcome = 0;

  // To solve with linear algebra
  machines.forEach((machine) => {
    const cost = solveWithLA(machine, {
      col: machine.prize.x,
      row: machine.prize.y,
    });

    if (cost) {
      outcome += cost;
    }
  });

  // To solve with dynamic programming
  // Does not solve part 2, it's too expensive
  // Use the linear algebra solution instead
  // machines.forEach((machine) => {
  //   mem = {};
  //   set(mem, [0, 0], {
  //     col: 0,
  //     row: 0,
  //   });
  //   viableLocations = [];

  //   solveWithDP(machine, {
  //     col: machine.prize.x,
  //     row: machine.prize.y,
  //   });

  //   const x = viableLocations.sort((a, b) => a.cost - b.cost)[0];

  //   if (x) {
  //     outcome += x.cost;
  //   }
  // });

  return outcome;
};

const solveWithLA = (machine: Machine, goal: Coordinate) => {
  const a = machine.prize.y;
  const b = machine.a.y;
  const c = machine.b.y;
  const e = machine.prize.x;
  const f = machine.a.x;
  const g = machine.b.x;

  const x = (c * e - g * a) / (-g * b + c * f);
  const y = (a - b * x) / c;

  if (Number.isInteger(x) && Number.isInteger(y)) {
    return x * Tokens.A + y * Tokens.B;
  }
  return undefined;
};

let mem = {} as Record<string, Record<string, Coordinate>>;
let viableLocations = [] as { coord: Coordinate; cost: number }[];

const solveWithDP = (machine: Machine, goal: Coordinate) => {
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
