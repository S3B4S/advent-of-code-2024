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
  for (const match of toMatch) {
    count += canConstructPattern(match, available) ? 1 : 0;
  }

  return count;
};

const canConstructPattern = (pattern: string, available: string[]): boolean => {
  const possibilities = [];
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

let mem = {} as Record<string, number>;

export const solvePart2 = (input: string) => {
  mem = {};

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
  for (const match of toMatch) {
    count += countPossiblePatterns(match, available);
  }

  return count;
};

const countPossiblePatterns = (
  pattern: string,
  available: string[]
): number => {
  if (mem[pattern]) {
    return mem[pattern];
  }

  const possibilities = [];

  for (const a of available) {
    if (pattern.startsWith(a)) {
      const newPattern = pattern.slice(a.length);

      possibilities.push({ newPattern, taken: a });
    }
  }

  if (possibilities.length === 0) {
    return 0;
  }

  const res = possibilities.reduce((acc, p) => {
    return (
      acc +
      (p.newPattern.length !== 0
        ? countPossiblePatterns(p.newPattern, available)
        : 1)
    );
  }, 0);

  mem[pattern] = res;
  return res;
};
