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

// Cache of A -> outcome values
let mem = {} as Record<string, string>;

// Cache of outcome values -> A
let memReversed = {} as Record<string, string>;

const reverseEngineerTree = (
  program: Opcode[],
  path: string = "",
  depth: number = 0
): string[] | undefined => {
  if (program.length === 0) {
    return [path];
  }

  let possibilities = [] as string[];

  for (let nCharacters = 1; nCharacters <= 6; nCharacters++) {
    const substring = program.slice(0, nCharacters).toReversed().join(",");
    if (memReversed[substring]) {
      possibilities = possibilities.concat(
        reverseEngineerTree(
          program.slice(nCharacters),
          memReversed[substring] + "," + path,
          depth + 1
        ) || []
      );
    }
  }

  // if (depth === 0) console.log("possibilities", possibilities);
  if (possibilities.length === 0) {
    return undefined;
  }

  return possibilities;
};

export const solvePart2 = (input: string) => {
  mem = {};

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

  // Just for simpleness sake, fill the memory cache with all combinations up to 2 ** 10
  // The A input can matter up to the 9th bit position (9th included), which is the 2 ** 9 (=== 8 ** 3), we want to calculate all possibiles in that range as well, so up to 2 ** 10

  const start = 0;
  const end = 8 ** 6;
  const step = 1;

  // When the first negative numbers started popping up
  // const start = 2147514097;
  // const duration = 1;

  let debugStream = "";

  for (let i = start; i <= end; i += step) {
    const currentA = i;
    registers.A = BigInt(currentA);
    registers.B = 0n;
    registers.C = 0n;

    let instructionPointer = 0;
    let outcomeStream = "";

    debugStream += `\n${currentA}, ${dec2bin(currentA)}: \n`;

    while (instructionPointer < program.length) {
      if (instructionPointer === 0 && mem[registers.A.toString()]) {
        outcomeStream += mem[registers.A.toString()]!;
        debugStream += `Outcome: ${outcomeStream.slice(0, -1)}\n`;
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

    mem[currentA.toString()] = outcomeStream;
    memReversed[outcomeStream.slice(0, -1)] = currentA.toString();
    debugStream += `Outcome: ${outcomeStream.slice(0, -1)}\n`;

    if (outcomeStream.slice(0, -1) === expectedOutcome) {
      return {
        registers,
        i,
        outcome: outcomeStream.slice(0, -1),
      };
    }
  }

  const programReversed = program.toReversed();
  const res = reverseEngineerTree(programReversed);

  if (!res) return { registers, i: -1, outcome: "" };

  for (const x of res) {
    const A = parseInt(
      x
        .slice(0, -1)
        .split(",")
        .map((n) => dec2bin(Number(n)))
        .join(""),
      2
    );

    registers.A = BigInt(A);
    registers.B = 0n;
    registers.C = 0n;

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

    if (outcomeStream.slice(0, -1) === expectedOutcome) {
      return {
        registers,
        i: -1,
        outcome: outcomeStream.slice(0, -1),
      };
    }
  }

  // console.log(mem);

  // Deno.writeFileSync(
  //   "./17_chronospatial-computer/~debug.txt",
  //   new TextEncoder().encode(debugStream)
  // );

  // for (const [key, value] of Object.entries(mem)) {
  //   console.log(
  //     key.padStart(10),
  //     dec2bin(Number(key)).padStart(20),
  //     value.slice(0, -1).padStart(10)
  //   );
  // }

  return {
    registers,
    i: -1,
    outcome: "",
  };
};

const dec2bin = (dec: number) => {
  return (dec >>> 0).toString(2);
};
