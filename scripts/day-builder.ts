import yargs from "https://deno.land/x/yargs/deno.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/exists.ts";
import { getDayTemplate, getTestFileTemplate } from "./templates.ts";
import { getBorderCharacters, table } from "table";
import chalk from "chalk";

const logTable = (content: unknown[][]) => {
  console.log(
    table(content, {
      border: getBorderCharacters("norc"),
    })
  );
};

const formatDay = (day: number) => String(day).padStart(2, "0");

const argv = await yargs(Deno.args)
  .command(
    ["scaffold", "sd"],
    `Scaffolds a new day for advent of code, downlaods the puzzle input as well
  
    - The name of the challenge is optional, if not provided it will be fetched from the AOC website
    - The day is optional, if not provided it will default to the current day
    - The year is optional, if not provided it will default to the current year
    - The session cookie is required, it can be provided as an environment variable named AOC_SESSION_COOKIE, it can be found in the browser after logging in to AOC, it is named "session" and is a long string of characters
    - If a directory with the same name as the target directory already exists, the script will prompt for confirmation before overwriting it
  `
  )
  .example(
    "deno run sd -n find-stars -d 2",
    'Creates a new directory named "02_find-stars" with the files "index.ts", "index.test.ts" and "input.txt". The last file containing the puzzle input downlaoded from AOC.'
  )

  .alias("n", "name")
  .describe("n", "The name of the challenge")
  .nargs("n", 1)

  .alias("d", "day")
  .describe("d", "The day of the challenge")
  .nargs("d", 1)
  .default("d", new Date().getDate())

  .alias("y", "year")
  .describe("y", "The year of the challenge")
  .nargs("y", 1)
  .default("y", new Date().getFullYear())

  .help("h")
  .alias("h", "help")
  .parse();

if (!Deno.env.get("AOC_SESSION_COOKIE")) {
  console.error(
    "AOC_SESSION_COOKIE environment variable is not set, please set it to your AOC session cookie. This is required to download the puzzle input."
  );
  Deno.exit(1);
}

const titleRegex =
  /(?<=<article class="day-desc"><h2>--- Day \d+: )(.*)(?= ---<\/h2>)/g;
const exampleInputRegex = /(?<=<pre><code>)([\s\S]*?)(?=<\/code><\/pre>)/g;

const urlSite = `https://adventofcode.com/${argv.y}/day/${argv.d}`;
const urlInput = `${urlSite}/input`;

const errorMessage =
  "Puzzle inputs differ by user. Please log in to get your puzzle input.";

logTable([
  ["Fetching puzzle data from", urlSite],
  ["Fetching puzzle input from", urlInput],
]);

Promise.all([
  fetch(urlSite, {
    headers: {
      cookie: `session=${Deno.env.get("AOC_SESSION_COOKIE")}`,
    },
  }),
  fetch(urlInput, {
    headers: {
      cookie: `session=${Deno.env.get("AOC_SESSION_COOKIE")}`,
    },
  }),
])
  .then((res) => Promise.all(res.map((r) => r.text())))
  .then(([siteData, inputData]) => {
    const exampleInput = siteData.match(exampleInputRegex)?.[0];
    const challengeTitleMatch = siteData.match(titleRegex);
    const challengeTitle =
      (argv.n as string | undefined) || challengeTitleMatch?.[0] || "challenge";
    const formattedChallengeTitle = challengeTitle
      .replaceAll(/[\?\!]/g, "")
      .replaceAll(/ /g, "-")
      .toLocaleLowerCase();
    const targetDir = `./${formatDay(argv.d)}_${formattedChallengeTitle}`;
    const indexFileTemplate = getDayTemplate();
    const testFileTemplate = getTestFileTemplate(
      formatDay(argv.d),
      targetDir.slice(2), // remove the first './'
      (exampleInput || "").trim()
    );

    logTable([
      ["Target directory", targetDir],
      ["For puzzle name", formattedChallengeTitle],
      ["For puzzle day", formatDay(argv.d)],
      [
        "Example input found",
        exampleInput ? chalk.bgGreen(" Yes ") : chalk.bgRed(" No "),
      ],
    ]);

    if (inputData.includes(errorMessage)) {
      console.error(
        chalk.red(
          "Puzzle input is not available, please check your session cookie, it's probably expired."
        )
      );
      console.error(
        chalk.red(
          "The files will still be created, but you will have to manually add the puzzle input or re-run the command after the cookie has been updated."
        )
      );
    }

    if (existsSync(targetDir)) {
      const answer = prompt(
        chalk.bold.yellow(
          `Directory ${targetDir} already exists, overwrite? [y/n]`
        )
      );

      if (["y", "yes"].includes(answer?.toLocaleLowerCase() || "n")) {
        console.log(chalk.black("Overwriting directory"));
      } else {
        console.log(chalk.red("Aborting"));
        Deno.exit(0);
      }
    }

    Deno.mkdirSync(targetDir, { recursive: true });
    Deno.writeTextFileSync(`${targetDir}/index.ts`, indexFileTemplate);
    Deno.writeTextFileSync(`${targetDir}/index.test.ts`, testFileTemplate);
    Deno.writeTextFileSync(`${targetDir}/input.txt`, inputData);
  });
