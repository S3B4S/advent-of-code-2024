import { partition } from "../utils/list.ts";

type Gate = "AND" | "OR" | "XOR";
type Wire = string;

const resolveGate = (gate: Gate, wire1Value: number, wire2Value: number) => {
  if (gate === "AND") {
    return wire1Value & wire2Value;
  }
  if (gate === "OR") {
    return wire1Value | wire2Value;
  }
  if (gate === "XOR") {
    return wire1Value ^ wire2Value;
  }

  throw new Error(`Unknown gate: ${gate}`);
};

export const solvePart1 = (input: string) => {
  const [inputs, gatesRaw] = input.split("\n\n");

  const startingWires = [...inputs.matchAll(/^(.*): (\d)$/gm)]
    .map(
      ([_, inputWire, startingValue]) =>
        [inputWire, Number(startingValue)] as [Wire, number]
    )
    .reduce((acc, [wire, value]) => {
      acc[wire] = value;
      return acc;
    }, {} as Record<Wire, number>);

  const gates = [
    ...gatesRaw.matchAll(/^(.*) (AND|XOR|OR) (.*) -> (.*)$/gm),
  ].map(([_, firstInput, gate, secondInput, output]) => [
    firstInput,
    secondInput,
    gate,
    output,
  ]) as [Wire, Wire, Gate, Wire][];

  const [startingCol, remainingGates] = partition(
    ([inputWire]) => inputWire.startsWith("x") || inputWire.startsWith("y"),
    gates
  );

  const knownValues = startingCol.reduce(
    (acc, [inputWire1, inputWire2, gate, outputWire]) => {
      acc[outputWire] = resolveGate(gate, acc[inputWire1], acc[inputWire2]);
      return acc;
    },
    startingWires
  );

  const remainingGatesMut = [...remainingGates];
  while (remainingGatesMut.length > 0) {
    for (const remainingGate of [...remainingGatesMut]) {
      const [inputWire1, inputWire2, gate, outputWire] = remainingGate;
      if (
        knownValues[inputWire1] !== undefined &&
        knownValues[inputWire2] !== undefined
      ) {
        knownValues[outputWire] = resolveGate(
          gate,
          knownValues[inputWire1],
          knownValues[inputWire2]
        );
        const index = remainingGatesMut.findIndex(
          (other) => other[3] === outputWire
        );
        if (index !== -1) {
          remainingGatesMut.splice(index, 1);
        }
      }
    }
  }

  return parseInt(
    Object.entries(knownValues)
      .filter(([wire]) => wire.startsWith("z"))
      .sort((a, b) => b[0].localeCompare(a[0]))
      .reduce((acc, [wire, value]) => {
        return acc + String(value);
      }, ""),
    2
  );
};

export const solvePart2 = (input: string) => {
  return 0;
};
