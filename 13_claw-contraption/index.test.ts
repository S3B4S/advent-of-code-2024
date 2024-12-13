import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./13_claw-contraption/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`.trim();

testWrapper("Day 13", () => {
  Deno.test("Part 1 - First machine of example input", () => {
    expect(
      solvePart1(`
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
`)
    ).toEqual(280);
  });

  Deno.test(
    "Part 1 - First machine of example input made smaller, 4 button presses each needed",
    () => {
      expect(
        solvePart1(`
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=464, Y=404
`)
      ).toEqual(16);
    }
  );

  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(480);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(36571);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(
      solvePart1(`
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=10000000008400, Y=10000000005400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=10000000012748, Y=10000000012176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=10000000007870, Y=10000000006450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=10000000018641, Y=10000000010279
`)
    ).toEqual(1);
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
