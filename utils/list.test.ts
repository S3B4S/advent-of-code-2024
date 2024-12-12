import { expect } from "jsr:@std/expect";
import { detectAmountOfGaps, forEachPair } from "./list.ts";

Deno.test("Find every pair in list - empty list", () => {
  const res = [] as [number, number][];
  forEachPair((a, b) => res.push([a, b]), []);
  expect(res).toStrictEqual([]);
});

Deno.test("Find every pair in list - list with elements", () => {
  const res = [] as [number, number][];
  forEachPair((a, b) => res.push([a, b]), [1, 2, 3, 4]);
  expect(res).toStrictEqual([
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
  ]);
});

Deno.test("Detect gaps in list", () => {
  expect(detectAmountOfGaps([1, 2, 3, 5, 6, 7, 10])).toEqual(2);
});

Deno.test("Detect gaps in list, with negative numbers", () => {
  expect(detectAmountOfGaps([-2, -1, 0])).toEqual(0);
});

Deno.test("Detect gaps in list, with negative numbers 2", () => {
  expect(detectAmountOfGaps([-4, -3, -1])).toEqual(1);
});

Deno.test("Detect missing 0 in list, with negative numbers", () => {
  expect(detectAmountOfGaps([-2, -1, 1, 2, 3])).toEqual(1);
});

Deno.test("Detect gaps in a list, all gaps", () => {
  expect(detectAmountOfGaps([1, 3, 5, 7, 9, 11])).toEqual(5);
});

Deno.test("Detect gaps in list, with big gap", () => {
  expect(detectAmountOfGaps([1, 2, 3, 6, 7, 10])).toEqual(2);
});

Deno.test("Detect gaps in list with no gaps", () => {
  expect(detectAmountOfGaps([1, 2, 3, 4, 5])).toEqual(0);
});

Deno.test("Detect gaps in list with single element", () => {
  expect(detectAmountOfGaps([1])).toEqual(0);
});

Deno.test("Detect gaps in an empty list", () => {
  expect(detectAmountOfGaps([])).toEqual(0);
});
