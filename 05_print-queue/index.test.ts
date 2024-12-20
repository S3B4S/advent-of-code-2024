import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./05_print-queue/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`.trim();

testWrapper("Day 05", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(143);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(6041);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(123);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(4884);
  });
});
