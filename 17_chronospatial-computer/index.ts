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

export const solvePart2 = (input: string) => {
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

  let outputSeq = "";

  const seqIds = {} as Record<string, number>;

  // Cache of A -> outcome values
  const mem = {} as Record<string, string>;

  // prettier-ignore
  const start = 8 ** 15;
  const end = 8 ** 16;

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

      // debugStream += `${registers.A},${registers.B},${registers.C} -> `;
      // debugStream += `${instruction},${operand} -> `;
      const { outcome, programExecuted } = instructions(
        instruction,
        operand,
        registers
      );

      // debugStream += `${programExecuted} -> `;
      // debugStream +=
      //   Object.values(registers).map((v) => dec2bin(Number(v))) + "\n";

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

    // console.log("cache set");
    mem[currentA.toString()] = outcomeStream;
    debugStream += `Outcome: ${outcomeStream.slice(0, -1)}\n`;
    // console.log(mem);

    // DEBUGGING
    // if (i === start + step * 100) {
    //   Deno.writeFileSync(
    //     "count3.json",
    //     new TextEncoder().encode(JSON.stringify(seqIds))
    //   );
    //   Deno.writeFileSync("sequences3.txt", new TextEncoder().encode(outputSeq));
    // }

    // if (i < start + step * 100) {
    //   seqIds[outcomeStream.slice(0, -1)] =
    //     (seqIds[outcomeStream.slice(0, -1)] ?? 0) + 1;

    //   outputSeq += i + ": " + outcomeStream.slice(0, -1) + "\n";
    // }

    if (outcomeStream.slice(0, -1) === expectedOutcome) {
      return {
        registers,
        i,
        outcome: outcomeStream.slice(0, -1),
      };
    }
  }

  Deno.writeFileSync(
    "./17_chronospatial-computer/~debug.txt",
    new TextEncoder().encode(debugStream)
  );

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
