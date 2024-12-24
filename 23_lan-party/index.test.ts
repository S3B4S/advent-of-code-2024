import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./23_lan-party/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`.trim();

testWrapper("Day 23", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(7);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(926);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual("co,de,ka,ta");
  });

  Deno.test(
    "Part 2 - Example input - all neighbours have same amount of outgoing edges that is not equal to nodes in clique",
    () => {
      expect(
        solvePart2(
          `
a-b
c-d
a-c
b-d
a-d
c-b
x-a
b-z
y-c
d-w
`.trim()
        )
      ).toEqual("a,b,c,d");
    }
  );

  Deno.test("Part 2 - Example input - should join marked field", () => {
    expect(
      solvePart2(
        `
kh-tc
qp-kh
qp-tc
`.trim()
      )
    ).toEqual("kh,qp,tc");
  });

  Deno.test(
    "Part 2 - Example input - 2 distinct marked fields should merge",
    () => {
      expect(
        solvePart2(
          `
kh-tc
qp-ip
kh-qp
kh-ip
tc-qp
tc-ip
`.trim()
        )
      ).toEqual("ip,kh,qp,tc");
    }
  );

  Deno.test("Part 2 - Example input - Return largest marked field", () => {
    expect(
      solvePart2(
        `
a-b
b-c
x-y
c-d
a-c
a-d
b-d
`.trim()
      )
    ).toEqual("a,b,c,d");
  });

  Deno.test(
    "Part 2 - Example input - Merge 2 marked fields with 1 being bigger",
    () => {
      expect(
        solvePart2(
          `
a-b
b-c
x-y
c-d
a-c
a-d
b-d
x-a
x-b
x-c
x-d
y-a
y-b
y-c
y-d
`.trim()
        )
      ).toEqual("a,b,c,d,x,y");
    }
  );

  Deno.test(
    "Part 2 - Example input - Bigger field is formed from a part of a second field",
    () => {
      expect(
        solvePart2(
          `
a-b
c-d
a-c
a-d
`.trim()
        )
      ).toEqual("a,c,d");
    }
  );

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
