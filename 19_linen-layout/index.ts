export const solvePart1 = (input: string) => {
  const [available, toMatch] = input
    .trim()
    .split("\n\n")
    .map((group, idx) => {
      if (idx === 0) {
        return group.split(", ");
      }
      if (idx === 1) {
        return group.split("\n");
      }
      return group;
    }) as [string[], string[]];

  let count = 0;
  // console.log(toMatch, available);
  for (const match of toMatch) {
    // console.log(match);
    count += canConstructPattern(match, available) ? 1 : 0;
    // console.log(count);
  }

  return count;
};

const canConstructPattern = (pattern: string, available: string[]): boolean => {
  let possibilities = [];
  for (const a of available) {
    if (pattern.startsWith(a)) {
      const newPattern = pattern.slice(a.length);

      if (newPattern.length === 0) {
        return true;
      }

      possibilities.push(newPattern);
    }
  }
  return possibilities.some((p) => canConstructPattern(p, available));
};

export const solvePart2 = (input: string) => {
  return 0;
};
