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
  node: Node,
  nextNumbers: number[],
  target: number
): Node | undefined => {
  if (node.value === target && nextNumbers.length === 0) return node;
  if (node.value > target || nextNumbers.length === 0) return;

  const op = nextNumbers[0];
  const remainingOps = nextNumbers.slice(1);

  node.left = {
    value: node.value * op,
  };

  node.middle = {
    value: Number(String(node.value) + String(op)),
  };

  node.right = {
    value: node.value + op,
  };

  return (
    calculateChildrenB(node.left, remainingOps, target) ||
    calculateChildrenB(node.middle, remainingOps, target) ||
    calculateChildrenB(node.right, remainingOps, target)
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

    const rootNode = {
      value: numbers[0],
    };

    const foundTarget = calculateChildrenB(rootNode, numbers.slice(1), target);

    if (foundTarget?.value) {
      count += foundTarget.value;
    }
  }

  return count;
};
