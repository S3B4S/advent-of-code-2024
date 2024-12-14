import { solvePart2 } from "./index.ts";

let fileInput: string;
try {
  fileInput = Deno.readTextFileSync("./14_restroom-redoubt/input.txt");
} catch {
  // In GitHub Actions the `Deno.readTextFileSync` will fail, as the `input.txt` is not committed to git.
  // So we assign an empty string, knowing that in GitHub Actions the fileInput won't be used anyway.
  fileInput = "";
}

solvePart2(fileInput, {
  nSeconds: 100 * 100,
  width: 101,
  height: 103,
});
