export const getDayTemplate = () => `
export const solvePart1 = (input: string) => {
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
`.trim() + '\n'

export const getTestFileTemplate = (day: string, directoryName: string, exampleInput: string) => `
import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./${directoryName}/input.txt");
} catch {
  // In GitHub Actions the \`Deno.readTextFileSync\` will fail, as the \`input.txt\` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = \`
${exampleInput}
\`.trim()

testWrapper("Day ${day}", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(0);
  });

  Deno.test.ignore("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(0);
  });

  Deno.test.ignore("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0);
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
`.trim() + '\n'