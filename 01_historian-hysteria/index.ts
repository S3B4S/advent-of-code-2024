export const solvePart1 = (input: string) => {
  const inputLines = input
    .trim()
    .split("\n")
    .map((line) => line.split("   "));

  const list1 = [] as number[];
  const list2 = [] as number[];

  for (const line of inputLines) {
    list1.push(parseInt(line[0]));
    list2.push(parseInt(line[1]));
  }

  list1.sort((a, b) => a - b);
  list2.sort((a, b) => a - b);

  let diff = 0;
  for (let i = 0; i < list1.length; i++) {
    diff += Math.abs(list1[i] - list2[i]);
  }
  return diff;
};

export const solvePart2 = (input: string) => {
  const inputLines = input
    .trim()
    .split("\n")
    .map((line) => line.split("   "));

  const list1 = [] as number[];
  const list2 = [] as number[];

  for (const line of inputLines) {
    list1.push(parseInt(line[0]));
    list2.push(parseInt(line[1]));
  }

  const mem = {} as Record<number, number>;

  let count = 0;

  for (const num of list1) {
    if (!mem[num]) {
      const countInList2 = list2.filter((n) => n === num).length;
      mem[num] = countInList2;
    }

    count += num * mem[num];
  }

  return count;
};
