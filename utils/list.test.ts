import { expect } from "jsr:@std/expect";
import { forEachPair } from "./list.ts";

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
