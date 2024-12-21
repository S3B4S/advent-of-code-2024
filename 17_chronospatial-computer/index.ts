import chalk from "chalk";

const resolveComboOperand = (operand: number, registers: Registers) => {
  if (operand <= 3) {
    return BigInt(operand);
  }

  return {
    4: registers.A,
    5: registers.B,
    6: registers.C,
  }[operand];
};

type Registers = {
  A: bigint;
  B: bigint;
  C: bigint;
};

const adv = (comboOperand: number, registers: Registers) => {
  const numerator = registers.A;
  const denominator = resolveComboOperand(comboOperand, registers)!;
  const result = numerator / BigInt(2) ** denominator;
  registers.A = result;
};

const bxl = (literalOperand: number, registers: Registers) => {
  registers.B = registers.B ^ BigInt(literalOperand);
};

const bst = (comboOperand: number, registers: Registers) => {
  const operand = resolveComboOperand(comboOperand, registers)!;
  registers.B = operand % BigInt(8);
};

const jnz = (literalOperand: number, registers: Registers) => {
  if (registers.A === BigInt(0)) return;

  return literalOperand;
};

const bxc = (operand: number, registers: Registers) => {
  registers.B = registers.B ^ registers.C;
};

const out = (comboOperand: number, registers: Registers) => {
  const operand = resolveComboOperand(comboOperand, registers)!;
  return operand % BigInt(8);
};

const bdv = (comboOperand: number, registers: Registers) => {
  const numerator = registers.A;
  const denominator = resolveComboOperand(comboOperand, registers)!;
  const result = numerator / BigInt(2) ** denominator;
  registers.B = result;
};

const cdv = (comboOperand: number, registers: Registers) => {
  const numerator = registers.A;
  const denominator = resolveComboOperand(comboOperand, registers)!;
  const result = numerator / BigInt(2) ** denominator;
  registers.C = result;
};

type Opcode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type ProgramName =
  | "adv"
  | "bxl"
  | "bst"
  | "jnz"
  | "bxc"
  | "out"
  | "bdv"
  | "cdv";

export const Programs: Record<
  Opcode,
  { fn: (operand: number, registers: Registers) => void; name: ProgramName }
> = {
  0: {
    fn: adv,
    name: "adv",
  },
  1: {
    fn: bxl,
    name: "bxl",
  },
  2: {
    fn: bst,
    name: "bst",
  },
  3: {
    fn: jnz,
    name: "jnz",
  },
  4: {
    fn: bxc,
    name: "bxc",
  },
  5: {
    fn: out,
    name: "out",
  },
  6: {
    fn: bdv,
    name: "bdv",
  },
  7: {
    fn: cdv,
    name: "cdv",
  },
};

const instructions = (
  opcode: Opcode,
  operand: number,
  registers: Registers
) => {
  const program = Programs[opcode]!;
  const outcome = program.fn(operand, registers);

  return {
    outcome,
    programExecuted: program.name,
  };
};

/**
 * Runs the program and returns the outcome, mutates the registers
 * @param program The program to run
 * @param registers The registers to use
 * @returns The outcome of the program
 */
const runProgram = (program: Opcode[], registers: Registers) => {
  let instructionPointer = 0;
  let outcomeStream = "";

  while (instructionPointer < program.length) {
    const instruction = program[instructionPointer];
    const operand = program[instructionPointer + 1];

    const { outcome, programExecuted } = instructions(
      instruction,
      operand,
      registers
    );

    if (programExecuted === "out") {
      outcomeStream += String(outcome) + ",";
    }

    if (programExecuted === "jnz") {
      // In the case of an jnz, we know that the outcome is the indeex to jump to
      instructionPointer = outcome!;
      continue;
    }

    instructionPointer += 2;
  }

  return {
    registers,
    outcome: outcomeStream.slice(0, -1),
  };
};

export const solvePart1 = (input: string) => {
  const registerValues = [
    ...input.trim().matchAll(/^Register [ABC]: (\d+)$/gm),
  ].map((m) => BigInt(m[1]));

  const program = [...input.trim().matchAll(/^Program: ((?:\d,)+\d)$/gm)][0][1]
    .split(",")
    .map((n) => Number(n)) as Opcode[];

  const registers = {
    A: registerValues[0],
    B: registerValues[1],
    C: registerValues[2],
  };

  return runProgram(program, registers);
};

// Cache of A -> outcome values
let mem = {} as Record<string, string>;

// Cache of outcome values -> A
let memReversed = {} as Record<string, string>;

/**
 * Runs the program and returns the outcome, mutates the registers
 * v2 uses the mem & memReversed as well
 * @param program The program to run
 * @param registers The registers to use
 * @returns The outcome of the program
 */
const runProgram2 = (program: Opcode[], registers: Registers) => {
  const snapshotA = registers.A;
  let instructionPointer = 0;
  let outcomeStream = "";

  while (instructionPointer < program.length) {
    if (instructionPointer === 0 && mem[registers.A.toString()]) {
      outcomeStream += mem[registers.A.toString()]!;
      break;
    }

    const instruction = program[instructionPointer];
    const operand = program[instructionPointer + 1];

    const { outcome, programExecuted } = instructions(
      instruction,
      operand,
      registers
    );

    if (programExecuted === "out") {
      outcomeStream += String(outcome) + ",";
    }

    if (programExecuted === "jnz") {
      // In the case of an jnz, we know that the outcome is the indeex to jump to
      instructionPointer = outcome!;
      continue;
    }

    instructionPointer += 2;
  }

  mem[snapshotA.toString()] = outcomeStream;
  memReversed[outcomeStream.slice(0, -1)] = snapshotA.toString();

  return {
    registers,
    outcome: outcomeStream.slice(0, -1),
  };
};

export const solvePart2 = (input: string) => {
  mem = {};
  memReversed = {};

  const registerValues = [
    ...input.trim().matchAll(/^Register [ABC]: (\d+)$/gm),
  ].map((m) => Number(m[1]));

  const program = [...input.trim().matchAll(/^Program: ((?:\d,)+\d)$/gm)][0][1]
    .split(",")
    .map((n) => Number(n)) as Opcode[];

  const registers = {
    A: BigInt(registerValues[0]),
    B: BigInt(registerValues[1]),
    C: BigInt(registerValues[2]),
  };

  const expectedOutcome = program.join(",");

  let c = 0;
  for (let x = 0; x < 100000000000000; x++) {
    for (let k = 0; k < 8; k++) {
      registers.A = BigInt(8 * x + k);
      registers.B = 0n;
      registers.C = 0n;

      const { outcome } = runProgram2(program, registers);

      if (
        outcome ===
        program.slice(expectedOutcome.split(",").length - (c + 1)).join(",")
      ) {
        // This is the full length of the program
        if (c === program.length - 1) {
          return 8 * x + k;
        }

        // The loop will increment x by 1, so we need to subtract 1 to get the correct x
        x = 8 * x + k - 1;
        c++;
        break;
      }
    }
  }

  return -1;
};
