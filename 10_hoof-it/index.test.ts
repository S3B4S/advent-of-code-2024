import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./10_hoof-it/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const exampleInput = `
0123
1234
8765
9876
`.trim();

testWrapper("Day 10", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solvePart1(exampleInput)).toEqual(1);
  });

  Deno.test("Part 1 - Example input 2", () => {
    expect(
      solvePart1(`
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9
`)
    ).toEqual(2);
  });

  Deno.test("Part 1 - Example input 3", () => {
    expect(
      solvePart1(`
..90..9
...1.98
...2..7
6543456
765.987
876....
987....
`)
    ).toEqual(4);
  });

  Deno.test("Part 1 - Example input 4", () => {
    expect(
      solvePart1(`
10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01
`)
    ).toEqual(3);
  });

  Deno.test("Part 1 - Example input - larger", () => {
    expect(
      solvePart1(`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`)
    ).toEqual(36);
  });

  Deno.test("Part 1 - File input", () => {
    expect(solvePart1(fileInput)).toEqual(629);
  });

  Deno.test("Part 2 - Example input", () => {
    expect(
      solvePart2(`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`)
    ).toEqual(81);
  });

  Deno.test("Part 2 - Example input - 2", () => {
    expect(
      solvePart2(`
.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....
`)
    ).toEqual(3);
  });

  Deno.test("Part 2 - Example input - 3", () => {
    expect(
      solvePart2(`
..90..9
...1.98
...2..7
6543456
765.987
876....
987....
`)
    ).toEqual(13);
  });

  Deno.test("Part 2 - Example input - 4", () => {
    expect(
      solvePart2(`
012345
123456
234567
345678
4.6789
56789.
`)
    ).toEqual(227);
  });

  Deno.test("Part 2 - File input", () => {
    expect(solvePart2(fileInput)).toEqual(1242);
  });
});
