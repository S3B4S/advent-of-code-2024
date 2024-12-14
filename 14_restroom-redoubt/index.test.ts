import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./14_restroom-redoubt/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`.trim();

const exampleInput2 = `
p=2,4 v=2,-3
`.trim();

testWrapper("Day 14", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(
      solvePart1(exampleInput, {
        nSeconds: 100,
        width: 11,
        height: 7,
      })
    ).toEqual(12);
  });

  Deno.test("Part 1 - Example input 2", () => {
    expect(
      solvePart1(exampleInput2, {
        nSeconds: 5,
        width: 11,
        height: 7,
      })
    ).toEqual(0);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(219512160);
  });

  // For part 2 we are visually inspecting the output, so we ignore it.
  Deno.test.ignore("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0);
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
