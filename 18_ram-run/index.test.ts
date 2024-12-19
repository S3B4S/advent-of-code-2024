import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./18_ram-run/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`.trim();

testWrapper("Day 18", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput, { width: 7, height: 7 }, 12)).toEqual(22);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(288);
  });

  Deno.test("Part 2 - Example input - reachable", () => {
    expect(solvePart1(exampleInput, { width: 7, height: 7 }, 20)).toEqual(24);
  });

  Deno.test("Part 2 - Example input - unreachable", () => {
    expect(solvePart1(exampleInput, { width: 7, height: 7 }, 21)).toEqual(-1);
  });

  Deno.test("Part 2 - Example input - Find blocking byte", () => {
    expect(solvePart2(exampleInput, { width: 7, height: 7 })).toStrictEqual({
      col: 6,
      row: 1,
    });
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toStrictEqual({ col: 52, row: 5 });
  });
});
