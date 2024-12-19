import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./19_linen-layout/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`.trim();

testWrapper("Day 19", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(6);
  });

  Deno.test("Part 1 - Example input - bwurrg", () => {
    expect(
      solvePart1(
        `
        r, wr, b, g, bwu, rb, gb, br

        bwurrg
        `
          .replaceAll(/^ +/gm, "")
          .trim()
      )
    ).toEqual(1);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(296);
  });

  Deno.test("Part 2 - Example input - brwrr", () => {
    expect(
      solvePart2(
        `
        r, wr, b, g, bwu, rb, gb, br

        brwrr
        `
          .replaceAll(/^ +/gm, "")
          .trim()
      )
    ).toEqual(2);
  });

  Deno.test("Part 2 - Example input - gbbr", () => {
    expect(
      solvePart2(
        `
        r, wr, b, g, bwu, rb, gb, br

        gbbr
        `
          .replaceAll(/^ +/gm, "")
          .trim()
      )
    ).toEqual(4);
  });

  Deno.test("Part 2 - Example input - rrbgbr", () => {
    expect(
      solvePart2(
        `
        r, wr, b, g, bwu, rb, gb, br

        rrbgbr
        `
          .replaceAll(/^ +/gm, "")
          .trim()
      )
    ).toEqual(6);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(16);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(619970556776002);
  });
});
