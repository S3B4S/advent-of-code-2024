export const solvePart1 = (input: string) => {
  const regex = /mul\((\d+),(\d+)\)/g;

  return [...input.matchAll(regex)].reduce(
    (acc, curr) => acc + Number(curr[1]) * Number(curr[2]),
    0
  );
};

export const solvePart2 = (input: string) => {
  const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
  const mulRegex = /mul\((\d+),(\d+)\)/;

  return [...input.matchAll(regex)]
    .map((x) => x[0])
    .reduce(
      (acc, curr) => {
        if (curr === "don't()" || curr === "do()") {
          return {
            take: curr === "do()",
            counter: acc.counter,
          };
        }

        if (!acc.take) {
          return acc;
        }

        const [_, x, y] = curr.match(mulRegex) as [string, string, string];
        return {
          take: acc.take,
          counter: acc.counter + Number(x) * Number(y),
        };
      },
      {
        take: true,
        counter: 0,
      }
    ).counter;
};
