import { expect } from "jsr:@std/expect";
import { Board, Direction } from "./board.ts";

Deno.test("Parse board", () => {
  const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  expect(board.encoding.getY("#")).toBe(0);
  expect(board.encoding.getY(".")).toBe(1);
  expect(board.encoding.getY("M")).toBe(2);
});

Deno.test("Should find M in the board with an unsafe method", () => {
  const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  expect(board.getCell({ col: 2, row: 2 })).toBe("M");
});

Deno.test(
  "Should throw when trying to find a cell out of bounds using an unsafe method",
  () => {
    const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

    const width = input.trim().split("\n")[0].trim().length;
    const height = input.trim().split("\n").length;
    const asStr = input.trim().replaceAll(/\s/g, "").trim();
    const board = new Board(asStr, width, height);

    expect(() => {
      board.getCell({ col: 10, row: 10 });
    }).toThrow();
  }
);

Deno.test("Should find M in the board with a safe method", () => {
  const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  expect(board.safeGetCell({ col: 2, row: 2 })).toBe("M");
});

Deno.test(
  "Should return undefined when trying to find a cell out of bounds using a safe method",
  () => {
    const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

    const width = input.trim().split("\n")[0].trim().length;
    const height = input.trim().split("\n").length;
    const asStr = input.trim().replaceAll(/\s/g, "").trim();
    const board = new Board(asStr, width, height);

    expect(board.safeGetCell({ col: 10, row: 10 })).toBeUndefined();
  }
);

Deno.test(
  "Should return the correct list of all possible characters in the board",
  () => {
    const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

    const width = input.trim().split("\n")[0].trim().length;
    const height = input.trim().split("\n").length;
    const asStr = input.trim().replaceAll(/\s/g, "").trim();
    const board = new Board(asStr, width, height);

    expect(board.allPossibleCharacters()).toEqual(["#", ".", "M"]);
  }
);

Deno.test("Should set a cell value correctly", () => {
  const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  board.setCell("X", { col: 2, row: 2 });
  expect(board.getCell({ col: 2, row: 2 })).toBe("X");
});

Deno.test("Should correctly find neighbours", () => {
  const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  const neighbours = board.neighbours({ col: 2, row: 2 });
  expect(neighbours).toEqual([
    { col: 1, row: 1 },
    { col: 2, row: 1 },
    { col: 3, row: 1 },
    { col: 1, row: 2 },
    { col: 3, row: 2 },
    { col: 1, row: 3 },
    { col: 2, row: 3 },
    { col: 3, row: 3 },
  ]);
});

Deno.test("Should find neighbours with custom directions", () => {
  const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  const neighbours = board.neighbours({ col: 2, row: 2 }, [
    Direction.N,
    Direction.S,
  ]);
  expect(neighbours).toEqual([
    { col: 2, row: 1 },
    { col: 2, row: 3 },
  ]);
});

Deno.test("Should find neighbours with custom distance", () => {
  const input = `
    #####
    #...#
    #.M.#
    #...#
    #####
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  const neighbours = board.neighbours(
    { col: 2, row: 2 },
    [Direction.N, Direction.S],
    2
  );
  expect(neighbours).toEqual([
    { col: 2, row: 0 },
    { col: 2, row: 4 },
  ]);
});

Deno.test("Should iterate over cells correctly", () => {
  const input = `
    ###
    #M#
    ###
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  const visited: string[] = [];
  board.iterateOverCells((value, coord) => {
    visited.push(`${value as string}@${coord.col},${coord.row}`);
  });

  expect(visited).toEqual([
    "#@0,0",
    "#@1,0",
    "#@2,0",
    "#@0,1",
    "M@1,1",
    "#@2,1",
    "#@0,2",
    "#@1,2",
    "#@2,2",
  ]);
});

Deno.test("Should convert board to string correctly", () => {
  const input = `
    ###
    #M#
    ###
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  const expected = "\n###\n#M#\n###";
  expect(board.toString()).toBe(expected);
});

Deno.test("Should get positions by key", () => {
  const input = `
    ###
    #M#
    ###
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  const mPositions = board.getPositionsByKey("M");
  expect(mPositions).toEqual([{ col: 1, row: 1 }]);

  const wallPositions = board.getPositionsByKey("#");
  expect(wallPositions.length).toBe(8);
});

Deno.test("Should iterate over specific character positions", () => {
  const input = `
    ###
    #M#
    ###
  `;

  const width = input.trim().split("\n")[0].trim().length;
  const height = input.trim().split("\n").length;
  const asStr = input.trim().replaceAll(/\s/g, "").trim();
  const board = new Board(asStr, width, height);

  const visited: string[] = [];
  board.iterateOver("#", (coord) => {
    visited.push(`${coord.col},${coord.row}`);
  });

  expect(visited.length).toBe(8);
});

Deno.test(
  "Should maintain correct character list when adding and removing characters",
  () => {
    const input = `
    ###
    #M#
    ###
  `;

    const width = input.trim().split("\n")[0].trim().length;
    const height = input.trim().split("\n").length;
    const asStr = input.trim().replaceAll(/\s/g, "").trim();
    const board = new Board(asStr, width, height);

    // Initial state should have # and M
    expect(board.allPossibleCharacters()).toEqual(["#", "M"]);

    // Add a new character X
    board.setCell("X", { col: 0, row: 1 });
    expect(board.allPossibleCharacters()).toEqual(["#", "M", "X"]);

    // Remove X by setting back to original character
    // This should have removed the X character
    board.setCell("M", { col: 0, row: 1 });
    expect(board.allPossibleCharacters()).toEqual(["#", "M"]);
  }
);

Deno.test(
  "Should keep positions by key correctly updated when replacing a character",
  () => {
    const input = `
    ###
    #M#
    ###
  `;

    const width = input.trim().split("\n")[0].trim().length;
    const height = input.trim().split("\n").length;
    const asStr = input.trim().replaceAll(/\s/g, "").trim();
    const board = new Board(asStr, width, height);

    // The ring of #
    expect(board.getPositionsByKey("#")).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
      { col: 0, row: 1 },
      { col: 2, row: 1 },
      { col: 0, row: 2 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
    ]);

    // Add a new character X replacing a #
    board.setCell("X", { col: 0, row: 1 });
    expect(board.getPositionsByKey("X")).toEqual([{ col: 0, row: 1 }]);
    expect(board.getPositionsByKey("#")).toEqual([
      { col: 0, row: 0 },
      { col: 1, row: 0 },
      { col: 2, row: 0 },
      { col: 2, row: 1 },
      { col: 0, row: 2 },
      { col: 1, row: 2 },
      { col: 2, row: 2 },
    ]);
  }
);
