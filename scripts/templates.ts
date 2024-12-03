export const getDayTemplate = () => `
export const solvePart1 = (input: string) => {
  return 0
}

export const solvePart2 = (input: string) => {
  return 0
}
`.trim() + '\n'

export const getTestFileTemplate = (day: string, exampleInput: string) => `
import { expect } from "jsr:@std/expect";
import { solvePart1, solvePart2 } from "./index.ts";

const fileInput = Deno.readTextFileSync("./03_mull-it-over/input.txt");
const exampleInput = \`
${exampleInput}
\`.trim()

Deno.test("Part 1 - Example input", () => {
  expect(solvePart1(exampleInput)).toEqual(0)
})

Deno.test.ignore("Part 1 - File input", () => {
  expect(solvePart1(fileInput)).toEqual(0)
})

Deno.test.ignore("Part 2 - Example input", () => {
  expect(solvePart2(exampleInput)).toEqual(0)
})

Deno.test.ignore("Part 2 - File input", () => {
  expect(solvePart2(fileInput)).toEqual(0)
})
`.trim() + '\n'