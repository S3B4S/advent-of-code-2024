import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./09_disk-fragmenter/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
2333133121414131402
`.trim();

testWrapper("Day 09", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(1928);
  });

  Deno.test("Part 1 - Example input - 2", () => {
    expect(solvePart1("12345")).toEqual(60);
  });

  Deno.test("Part 1 - Example input - 3", () => {
    // Very edge-case, not sure if the ID would be 1 or 0 for the amount of 3 in this case
    expect(solvePart1("043")).toEqual(3);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(6258319840548);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(2858);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(6286182965311);
  });
});
