import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./07_bridge-repair/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`.trim();

testWrapper("Day 07", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(3749);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(4364915411363);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(11387);
  });

  Deno.test("Part 2 - Example input - All concatenation", () => {
    expect(
      solvePart2(`
        147218041: 147 21 8 0 41
      `)
    ).toEqual(147218041);
  });

  Deno.test("Part 2 - Example input - All +", () => {
    expect(
      solvePart2(`
        217: 147 21 8 0 41
      `)
    ).toEqual(217);
  });

  Deno.test("Part 2 - Example input - All * with 0", () => {
    expect(
      solvePart2(`
        0: 147 21 8 0 41
      `)
    ).toEqual(0);
  });

  Deno.test("Part 2 - Example input - All *", () => {
    expect(
      solvePart2(`
        1012536: 147 21 8 1 41
      `)
    ).toEqual(1012536);
  });

  Deno.test("Part 2 - Example input - Shouldn't accept", () => {
    expect(
      solvePart2(`
        42: 147 21 8 1 41
      `)
    ).toEqual(0);
  });

  Deno.test("Part 2 - Example input - Don't accept partial answer", () => {
    expect(
      solvePart2(`
        100: 10 10 3
      `)
    ).toEqual(0);
  });

  // 39150794090326 -> too high
  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(38322057216320);
  });
});
