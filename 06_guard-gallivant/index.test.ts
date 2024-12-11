import { expect } from "jsr:@std/expect";
import { coordsBetween, solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./06_guard-gallivant/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`.trim();

testWrapper("Day 06", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(41);
  });

  Deno.test("Part 1 - Example input - North into nothing", () => {
    // prettier-ignore
    expect(solvePart1(`
......
......
...^..
    `)).toEqual(3);
  });

  Deno.test("Part 1 - Example input - North into nothing", () => {
    // prettier-ignore
    expect(solvePart1(`
...#..
......
...^..
    `)).toEqual(4);
  });

  Deno.test("Part 1 - Example - Coords between - row", () => {
    expect(coordsBetween({ col: 4, row: 4 }, { col: 7, row: 4 })).toStrictEqual(
      [
        { col: 5, row: 4 },
        { col: 6, row: 4 },
      ]
    );
  });

  Deno.test("Part 1 - Example - Next to each other - row", () => {
    expect(coordsBetween({ col: 4, row: 4 }, { col: 5, row: 4 })).toStrictEqual(
      []
    );
  });

  Deno.test("Part 1 - Example - Coords between - col", () => {
    expect(
      coordsBetween({ col: 4, row: 4 }, { col: 4, row: 11 })
    ).toStrictEqual([
      { col: 4, row: 5 },
      { col: 4, row: 6 },
      { col: 4, row: 7 },
      { col: 4, row: 8 },
      { col: 4, row: 9 },
      { col: 4, row: 10 },
    ]);
  });

  Deno.test("Part 1 - Example - Next to each other - col", () => {
    expect(coordsBetween({ col: 4, row: 3 }, { col: 4, row: 4 })).toStrictEqual(
      []
    );
  });

  Deno.test("Part 1 - Example - Same", () => {
    expect(coordsBetween({ col: 4, row: 4 }, { col: 4, row: 4 })).toStrictEqual(
      []
    );
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(5101);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(6);
  });

  Deno.test.only("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(1951);
  });
});
