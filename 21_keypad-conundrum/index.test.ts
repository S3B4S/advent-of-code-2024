import { expect } from "jsr:@std/expect";
import { directionalKeypadInput, numericKeypadInput, solve } from "./index.ts";
import { testWrapper } from "../utils/misc.ts";
import { isOdd } from "../utils/number.ts";
import { Board, Characters } from "../utils/board.ts";
import {
  recResolveInstr,
  resolveInstructions,
  resolveToShortestPath,
} from "./helpers.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./21_keypad-conundrum/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

const AMOUNT_ROBOTS = {
  "part-1": 2,
  "part-2": 25,
};

const exampleInput = `
029A
980A
179A
456A
379A
`.trim();

testWrapper("Day 21", () => {
  Deno.test("Part 1 - Example input", () => {
    expect(solve(exampleInput, AMOUNT_ROBOTS["part-1"])).toEqual(126384);
  });

  Deno.test("Part 1 - Example input - simpler - 1 input", () => {
    expect(solve("029A", AMOUNT_ROBOTS["part-1"])).toEqual(1972);
  });

  Deno.test("Part 1 - Example input - simpler - 2 inputs", () => {
    expect(
      solve(
        `
029A
980A
      `.trim(),
        AMOUNT_ROBOTS["part-1"]
      )
    ).toEqual(60772);
  });

  //   Deno.test(
  //     "Part 1 - Example input - simpler - 1 input with ambigious paths",
  //     () => {
  //       expect(
  //         solve(
  //           `
  // 20
  // 02
  //       `.trim()
  //         )
  //       ).toEqual(10);
  //     }
  //   );

  Deno.test("Part 1 - Example input - isolate bug", () => {
    expect(
      solve(
        `
379A
      `.trim(),
        AMOUNT_ROBOTS["part-1"]
      )
    ).toEqual(24256);
  });

  Deno.test("Part 1 - Recrusive resolve path", () => {
    const keypad = numericKeypadInput
      .split("\n")
      .filter((_, idx) => isOdd(idx))
      .map((line) => {
        const chars = line
          .slice(2)
          .slice(0, -2)
          .split(" | ")
          .map((char) => (char === Characters.Space ? Characters.X : char));
        return chars;
      });

    const directionalKeypad = directionalKeypadInput
      .split("\n")
      .filter((_, idx) => isOdd(idx))
      .map((line) =>
        line
          .slice(2)
          .slice(0, -2)
          .split(" | ")
          .map((char) => (char === Characters.Space ? Characters.X : char))
      );

    const numericBoard = new Board(
      keypad.flat(1),
      keypad[0].length,
      keypad.length
    );

    const dpadBoard = new Board(
      directionalKeypad.flat(1),
      directionalKeypad[0].length,
      directionalKeypad.length
    );

    expect(
      recResolveInstr(
        numericBoard,
        numericBoard.getPositionsByKey("A")[0],
        "20"
      )
    ).toStrictEqual(["^<AvA", "<^AvA"]);
  });

  Deno.test("Part 1 - Resolve to shortest path given multiple boards", () => {
    const keypad = numericKeypadInput
      .split("\n")
      .filter((_, idx) => isOdd(idx))
      .map((line) => {
        const chars = line
          .slice(2)
          .slice(0, -2)
          .split(" | ")
          .map((char) => (char === Characters.Space ? Characters.X : char));
        return chars;
      });

    const directionalKeypad = directionalKeypadInput
      .split("\n")
      .filter((_, idx) => isOdd(idx))
      .map((line) =>
        line
          .slice(2)
          .slice(0, -2)
          .split(" | ")
          .map((char) => (char === Characters.Space ? Characters.X : char))
      );

    const numericBoard = new Board(
      keypad.flat(1),
      keypad[0].length,
      keypad.length
    );

    const dpadBoard = new Board(
      directionalKeypad.flat(1),
      directionalKeypad[0].length,
      directionalKeypad.length
    );

    expect(
      resolveToShortestPath([dpadBoard, dpadBoard, numericBoard], "2")
    ).toEqual("<vA<AA>>^AvA<^A>AvA^A");
  });

  Deno.test("Part 1 - Recrusive resolve paths", () => {
    const keypad = numericKeypadInput
      .split("\n")
      .filter((_, idx) => isOdd(idx))
      .map((line) => {
        const chars = line
          .slice(2)
          .slice(0, -2)
          .split(" | ")
          .map((char) => (char === Characters.Space ? Characters.X : char));
        return chars;
      });

    const directionalKeypad = directionalKeypadInput
      .split("\n")
      .filter((_, idx) => isOdd(idx))
      .map((line) =>
        line
          .slice(2)
          .slice(0, -2)
          .split(" | ")
          .map((char) => (char === Characters.Space ? Characters.X : char))
      );

    const numericBoard = new Board(
      keypad.flat(1),
      keypad[0].length,
      keypad.length
    );

    const dpadBoard = new Board(
      directionalKeypad.flat(1),
      directionalKeypad[0].length,
      directionalKeypad.length
    );

    expect(resolveInstructions(numericBoard, ["20", "02"])).toStrictEqual({
      "20": ["^<AvA", "<^AvA"],
      "02": ["<A^A"],
    });
  });

  Deno.test("Part 1 - File input", () => {
    expect(solve(fileInput, AMOUNT_ROBOTS["part-1"])).toEqual(237342);
  });

  Deno.test.ignore("Part 2 - Example input", () => {
    expect(solve(exampleInput, AMOUNT_ROBOTS["part-2"])).toEqual(0);
  });

  Deno.test.ignore("Part 2 - File input", () => {
    expect(solve(fileInput, AMOUNT_ROBOTS["part-2"])).toEqual(0);
  });
});
