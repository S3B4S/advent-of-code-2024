import figlet from "figlet";

const figletOptions: figlet.Options = {
  font: "Small",
};

/**
 * Wraps a set of tests in a group with a title
 * @param str the title of the test group
 * @param body the tests to run
 */
export const testWrapper = (str: string, body: () => void) => {
  console.group();
  console.log(figlet.textSync(str, figletOptions));
  console.log();

  body();

  console.groupEnd();
};

/**
 * Assumes the directory is named "DD_name"
 * @returns The day of the directory, e.g. "01"
 */
export const getDayOfDirectory = (dir: string) =>
  dir.split("/").pop()?.split("_").shift();

/**
 *
 * @param dir The directory of the day, e.g. "<path-to>/01_challenge"
 * @returns The contents of the file named `input.txt` in the directory
 */
export const getFileInput = (dir: string) =>
  Deno.readFileSync(dir + "/input.txt");

/**
 * Wrap a value to log it and then return straight away.
 * Useful in places like a chain or pipe.
 *
 * Example:
 * ```ts
 * const result = logId(lines
 *  .filter(x => x.includes('something'))) // Will log the filtered lines while keeping the chain going
 *  .map(x => x.trim())
 * ```
 */
export const logId = (yourDreamsAndHopes: any) => {
  console.log(yourDreamsAndHopes);
  return yourDreamsAndHopes;
};
