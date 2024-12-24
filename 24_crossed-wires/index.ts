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

  console.log(startingCol);

  let remainingGatesMut = [...remainingGates];
  let prevColOutputs = startingCol.map(([_, _2, _3, output]) => output);
  const intermediateCols = [];

  let i = 0;
  while (
    !remainingGatesMut.every(([_, _2, _3, output]) => output.startsWith("z"))
  ) {
    if (i > 0) {
      break;
    }
    console.log(prevColOutputs);
    console.log(remainingGatesMut);
    // Then we repeat with the output gates of prev col for next cols
    const [col, remaining] = partition(
      ([inputWire]) => prevColOutputs.includes(inputWire),
      remainingGates
    );
    intermediateCols.push(col);
    remainingGatesMut = remaining;
    prevColOutputs = col.map(([_, _2, _3, output]) => output);
    i++;
  }
  const cols = [startingCol, ...intermediateCols, remainingGatesMut];

  // Now we can resolve per column
  const wireValues = cols.reduce((wireValues, col) => {
    const newWireValues = { ...wireValues };
    for (const [inputWire1, inputWire2, gate, output] of col) {
      const calculate = resolveGate(
        gate,
        wireValues[inputWire1],
        wireValues[inputWire2]
      );

      newWireValues[output] = calculate;
    }
    return newWireValues;
  }, startingWires);

  return parseInt(
    Object.entries(wireValues)
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
