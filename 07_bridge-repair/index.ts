type Node = {
  value: number;
  left?: Node;
  middle?: Node;
  right?: Node;
};

// Right = *
// Left = +
const calculateChildren = (
  node: Node,
  nextNumbers: number[],
  target: number
): Node | undefined => {
  if (node.value === target && nextNumbers.length === 0) return node;
  if (nextNumbers.length === 0) return;

  let resultingNode = undefined;

  const resMultiplication = node.value * nextNumbers[0];
  node.left = {
    value: resMultiplication,
  };
  if (resMultiplication <= target)
    resultingNode =
      resultingNode ||
      calculateChildren(node.left, nextNumbers.slice(1), target);

  const resAddition = node.value + nextNumbers[0];
  node.right = {
    value: resAddition,
  };
  if (resAddition <= target)
    resultingNode =
      resultingNode ||
      calculateChildren(node.right, nextNumbers.slice(1), target);

  return resultingNode;
};

export const solvePart1 = (input: string) => {
  const lines = input.trim().split("\n");

  let count = 0;
  for (const line of lines) {
    const [target, numbers] = line.split(": ").map((x, i) => {
      if (i !== 1) return Number(x);
      return x.split(" ").map((x) => Number(x));
    }) as [number, number[]];

    const rootNode = {
      value: numbers[0],
    };

    const foundTarget = calculateChildren(rootNode, numbers.slice(1), target);

    if (foundTarget?.value) {
      count += foundTarget.value;
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
