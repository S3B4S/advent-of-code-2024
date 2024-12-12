import { expect } from "jsr:@std/expect";
import { scanRegionPerimeter, solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";
import { HashSet } from "../utils/hashSet.ts";
import { Coordinate, stringifyCoord } from "../utils/board.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./12_garden-groups/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
AAAA
BBCD
BBCC
EEEC
`.trim();

const exampleInput2 = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`.trim();

const exampleInput3 = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`.trim();
const isolateBug = `
...CC.
...CCC
..CC..
CCC...
.C....
.CC...
..C...
`.trim();

const isolateBug2 = `
........FF
.........F
.......FFF
.......FFF
........F.
..........
..........
..........
..........
..........
`.trim();

testWrapper("Day 12", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(140);
  });

  Deno.test("Part 1 - Example input 2", () => {
    expect(solvePart1(exampleInput2)).toEqual(1930);
  });

  Deno.test("Part 1 - Example input 3", () => {
    expect(solvePart1(exampleInput3)).toEqual(772);
  });

  // Deno.test.only("Part 1 - Isolate bug", () => {
  //   expect(solvePart1(isolateBug)).toEqual(100);
  // });

  // Deno.test("Part 1 - Isolate bug 2", () => {
  //   expect(solvePart1(isolateBug2)).toEqual(100);
  // });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(1363682);
  });

  Deno.test.ignore("Part 2 - Example input", () => {
    expect(solvePart2(exampleInput)).toEqual(0);
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(0);
  });

  // Region perimeter scan tests
  Deno.test("Region perimeter scan - Example input", () => {
    const region = new HashSet<Coordinate>(stringifyCoord);

    // X
    // X X
    // X X
    // XXX X
    // XXX X
    // XXX X
    // XXXXX

    [
      { col: 0, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: 2 },
      { col: 0, row: 3 },
      { col: 0, row: 4 },
      { col: 0, row: 5 },
      { col: 1, row: 3 },
      { col: 1, row: 4 },
      { col: 1, row: 5 },
      { col: 1, row: 6 },
      { col: 2, row: 1 },
      { col: 2, row: 2 },
      { col: 2, row: 3 },
      { col: 2, row: 4 },
      { col: 2, row: 5 },
      { col: 2, row: 6 },
      { col: 3, row: 6 },
      { col: 4, row: 3 },
      { col: 4, row: 4 },
      { col: 4, row: 5 },
      { col: 4, row: 6 },
    ].forEach((coord) => region.include(coord));

    expect(scanRegionPerimeter(region)).toEqual(24 /* rows */ + 10 /* cols */);
  });
});
