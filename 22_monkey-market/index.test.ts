import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./22_monkey-market/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
1
10
100
2024
`.trim();

testWrapper("Day 22", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(37327623n);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(15006633487n);
  });

  // Deno.test.only("Part 2 - [DEBUG] Example input", () => {
  //   expect(solvePart2("123")).toEqual(37327623n);
  // });

  Deno.test("Part 2 - Example input", () => {
    expect(
      solvePart2(
        `
      1
      2
      3
      2024`
          .trim()
          .replaceAll(/^ /gm, "")
      )
    ).toEqual(23);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(1710);
  });
});
