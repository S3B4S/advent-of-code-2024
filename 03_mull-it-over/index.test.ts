import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

const fileInput = Deno.readTextFileSync("./03_mull-it-over/input.txt");
const exampleInput = `
x<em>mul(2,4)</em>%&mul[3,7]!@^do_not_<em>mul(5,5)</em>+mul(32,64]then(<em>mul(11,8)mul(8,5)</em>)
`.trim();
const exampleInput2 = `
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`.trim();

testWrapper("Day 3", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(161);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(182619815);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput2)).toEqual(48);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(80747545);
  });
});
