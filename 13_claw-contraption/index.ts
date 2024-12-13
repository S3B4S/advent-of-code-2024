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
  machines.forEach((machine) => {
    const res = solveRecPart1(machine, 0, 0, 0);
    if (Number.isFinite(res)) {
      outcome += res;
    }
  });

  return outcome;
};

const mem = {} as Record<string, number>;
const stringifyMachine = (machine: Machine) => {
  return `ax:${machine.a.x}, ay:${machine.a.y}|bx:${machine.b.x}, by:${machine.b.y}|px:${machine.prize.x}, py:${machine.prize.y}`;
};

const solveRecPart1 = (
  machine: Machine,
  totalSpent: number,
  buttonPressesA: number,
  buttonPressesB: number
): number => {
  if (buttonPressesA > 100 || buttonPressesB > 100) {
    return Infinity;
  }

  const cached = mem[stringifyMachine(machine)];
  if (cached) {
    return cached;
  }

  if (machine.prize.x === 0 && machine.prize.y === 0) {
    return totalSpent;
  }

  if (machine.prize.x < 0 || machine.prize.y < 0) {
    return Infinity;
  }

  const copyA = {
    a: { ...machine.a },
    b: { ...machine.b },
    prize: { ...machine.prize },
  };

  const copyB = {
    a: { ...machine.a },
    b: { ...machine.b },
    prize: { ...machine.prize },
  };

  // We press button A:
  copyA.prize.x -= copyA.a.x;
  copyA.prize.y -= copyA.a.y;
  const costA = solveRecPart1(
    copyA,
    totalSpent + Tokens.A,
    buttonPressesA + 1,
    buttonPressesB
  );

  mem[stringifyMachine(copyA)] = costA;

  // We press button B:
  copyB.prize.x -= copyB.b.x;
  copyB.prize.y -= copyB.b.y;
  const costB = solveRecPart1(
    copyB,
    totalSpent + Tokens.B,
    buttonPressesA,
    buttonPressesB + 1
  );

  mem[stringifyMachine(copyB)] = costB;

  return Math.min(costA, costB);
};

export const solvePart2 = (input: string) => {
  return 0;
};
