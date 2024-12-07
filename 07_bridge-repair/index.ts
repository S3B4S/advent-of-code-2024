// Right = *
// Left = +
const calculateChildren = (
  currentValue: number,
  nextNumbers: number[],
  target: number
): number | undefined => {
  if (currentValue === target && nextNumbers.length === 0) return currentValue;
  if (currentValue > target || nextNumbers.length === 0) return;

  const left = currentValue * nextNumbers[0];
  const right = currentValue + nextNumbers[0];

  return (
    calculateChildren(left, nextNumbers.slice(1), target) ||
    calculateChildren(right, nextNumbers.slice(1), target)
  );
};

export const solvePart1 = (input: string) => {
  const lines = input.trim().split("\n");

  let count = 0;
  for (const line of lines) {
    const [target, numbers] = line.split(": ").map((x, i) => {
      if (i !== 1) return Number(x);
      return x.split(" ").map((x) => Number(x));
    }) as [number, number[]];

    const foundTarget = calculateChildren(numbers[0], numbers.slice(1), target);

    if (foundTarget) {
      count += foundTarget;
    }
  }

  return count;
};

// Right = *
// Middle = ||
// Left = +
const calculateChildrenB = (
  currentValue: number,
  nextNumbers: number[],
  target: number
): number | undefined => {
  if (currentValue === target && nextNumbers.length === 0) return currentValue;
  if (currentValue > target || nextNumbers.length === 0) return;

  const op = nextNumbers[0];
  const remainingOps = nextNumbers.slice(1);

  const left = currentValue * op;
  const middle = Number(String(currentValue) + String(op));
  const right = currentValue + op;

  return (
    calculateChildrenB(left, remainingOps, target) ||
    calculateChildrenB(middle, remainingOps, target) ||
    calculateChildrenB(right, remainingOps, target)
  );
};

export const solvePart2 = (input: string) => {
  const lines = input.trim().split("\n");

  let count = 0;
  for (const line of lines) {
    const [target, numbers] = line.split(": ").map((x, i) => {
      if (i !== 1) return Number(x);
      return x.split(" ").map((x) => Number(x));
    }) as [number, number[]];

    const foundTarget = calculateChildrenB(
      numbers[0],
      numbers.slice(1),
      target
    );

    if (foundTarget) {
      count += foundTarget;
    }
  }

  return count;
};
