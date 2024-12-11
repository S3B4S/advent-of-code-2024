import { expect } from "jsr:@std/expect";
import { solve } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./11_plutonian-pebbles/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
125 17
`.trim();

testWrapper("Day 11", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solve(exampleInput)).toEqual(55312);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solve(fileInput)).toEqual(217812);
  });

  // Deno.test("Part 2 - Example input", () => {
  //   expect(solve(exampleInput, 75)).toEqual(0);
  // });

  Deno.test("Part 2 - File input", () => {
    expect(solve(fileInput, 75)).toEqual(259112729857522);
  });
});
