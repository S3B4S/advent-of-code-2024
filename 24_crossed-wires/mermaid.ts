import { partition } from "../utils/list.ts";

const fileInputName = Deno.args[0];

const parseLine = (line: string) => {
  const [_, input1, gate, input2, output] = line.match(
    /(.*) (OR|XOR|AND) (.*) -> (.*)/
  )!;
  return { input1, gate, input2, output };
};

const MermaidBuilder = () => {
  let stream = "";

  const addLine = (line: string, indent = 0) => {
    stream += " ".repeat(indent * 2) + line + "\n";
  };

  const build = () => {
    return stream;
  };

  return { addLine, build };
};

const mb = MermaidBuilder();

mb.addLine("flowchart-elk TD");

const text = Deno.readTextFileSync(fileInputName || "./example.txt").trim();

const [startingWires, wires] = partition((line) => {
  return line.startsWith("x") || line.startsWith("y");
}, text.split("\n"));

// Find gate identifier by output name
const mem: Record<string, string> = {};

startingWires.forEach((line) => {
  const { input1, gate, input2, output } = parseLine(line);

  const gateId = `${gate}_${output}`;
  mem[output] = gateId;
  mb.addLine(`${input1} --> ${gateId}`, 1);
  mb.addLine(`${input2} --> ${gateId}`, 1);
});

while (wires.length > 0) {
  for (const wire of wires) {
    const { input1, gate, input2, output } = parseLine(wire);

    if (mem[input1] && mem[input2]) {
      const gateId = `${gate}_${output}`;
      mem[output] = gateId;
      mb.addLine(`${mem[input1]} --> ${gateId}`, 1);
      mb.addLine(`${mem[input2]} --> ${gateId}`, 1);

      wires.splice(
        wires.findIndex((otherWire) => parseLine(otherWire).output === output),
        1
      );
    }
  }
}

console.log(mb.build());
