import { expect } from "jsr:@std/expect";
import { Programs, solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";
import deno from "https://deno.land/x/y18n@v5.0.0-deno/lib/platform-shims/deno.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./17_chronospatial-computer/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
  Register A: 729
  Register B: 0
  Register C: 0

  Program: 0,1,5,4,3,0
`
  .replaceAll(/^ +/gm, "")
  .trim();

testWrapper("Day 17", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput).outcome).toEqual("4,6,3,5,6,3,5,2,1,0");
  });

  Deno.test("Part 1 - adv", () => {
    const input = `
      Register A: 800
      Register B: 0
      Register C: 0

      Program: 0,5
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(800),
      B: BigInt(0),
      C: BigInt(0),
    });
  });

  Deno.test("Part 1 - bxl", () => {
    const input = `
      Register A: 0
      Register B: 777
      Register C: 0

      Program: 1,7
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(0),
      B: BigInt(782),
      C: BigInt(0),
    });
  });

  Deno.test("Part 1 - bst", () => {
    const input = `
      Register A: 0
      Register B: 0
      Register C: 9

      Program: 2,6
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(0),
      B: BigInt(1),
      C: BigInt(9),
    });
  });

  Deno.test("Part 1 - jnz - should do nothing", () => {
    const input = `
      Register A: 0
      Register B: 0
      Register C: 9

      Program: 3,6
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(0),
      B: BigInt(0),
      C: BigInt(9),
    });
  });

  Deno.test("Part 1 - jnz - should jump", () => {
    const input = `
      Register A: 1
      Register B: 100
      Register C: 0

      Program: 3,4,2,6,1,6
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(1),
      B: BigInt(98),
      C: BigInt(0),
    });
  });

  Deno.test("Part 1 - bxc", () => {
    const input = `
      Register A: 0
      Register B: 849
      Register C: 911

      Program: 4,3
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(0),
      B: BigInt(222),
      C: BigInt(911),
    });
  });

  Deno.test("Part 1 - bdv", () => {
    const input = `
      Register A: 800
      Register B: 0
      Register C: 0

      Program: 6,5
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(800),
      B: BigInt(800),
      C: BigInt(0),
    });
  });

  Deno.test("Part 1 - cdv", () => {
    const input = `
      Register A: 800
      Register B: 0
      Register C: 0

      Program: 7,5
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers).toStrictEqual({
      A: BigInt(800),
      B: BigInt(0),
      C: BigInt(800),
    });
  });

  Deno.test("Part 1 - Test program 1", () => {
    const input = `
      Register A: 10
      Register B: 0
      Register C: 0

      Program: 5,0,5,1,5,4
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).outcome).toEqual("0,1,2");
  });

  Deno.test("Part 1 - Test program 2", () => {
    const input = `
      Register A: 2024
      Register B: 0
      Register C: 0

      Program: 0,1,5,4,3,0
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).outcome).toEqual("4,2,5,6,7,7,7,7,3,1,0");
    expect(solvePart1(input).registers.A).toEqual(BigInt(0));
  });

  Deno.test("Part 1 - Test program 3", () => {
    const input = `
      Register A: 0
      Register B: 29
      Register C: 0

      Program: 1,7
      `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers.B).toEqual(BigInt(26));
  });

  Deno.test("Part 1 - Test program 4", () => {
    const input = `
      Register A: 0
      Register B: 2024
      Register C: 43690

      Program: 4,0
    `
      .replaceAll(/^ +/gm, "")
      .trim();

    expect(solvePart1(input).registers.B).toEqual(BigInt(44354));
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput).outcome).toEqual("4,0,4,7,1,2,7,1,6");
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
