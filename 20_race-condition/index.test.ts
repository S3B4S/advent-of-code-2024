import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./20_race-condition/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`.trim();

const exampleInput2 = `
#######
#S##E.#
#...#.#
###...#
#######
`.trim();

testWrapper("Day 20", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toStrictEqual({
      cheatingRoutes: {
        2: 14,
        4: 14,
        6: 2,
        8: 4,
        10: 2,
        12: 3,
        20: 1,
        36: 1,
        38: 1,
        40: 1,
        64: 1,
      },
      saveAtLeast100: 0,
    });
  });

  Deno.test("Part 1 - Example input 2", () => {
    expect(solvePart1(exampleInput2)).toStrictEqual({
      cheatingRoutes: {
        2: 2,
        4: 1,
      },
      saveAtLeast100: 0,
    });
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput).saveAtLeast100).toEqual(1389);
  });

  Deno.test.ignore("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0);
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });
});
