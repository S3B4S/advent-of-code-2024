import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./25_code-chronicle/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`.trim();

testWrapper("Day 25", () => {
  Deno.test("Part 1 - One exact fitting key-lock pairs", () => {
    expect(
      solvePart1(
        `
.....
.....
.....
#....
#.#..
#.#.#
#####

#####
#####
#####
.####
.#.##
.#.#.
.....
`.trim()
      )
    ).toEqual(1);
  });

  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(3);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(3495);
  });

  Deno.test.ignore("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0);
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
