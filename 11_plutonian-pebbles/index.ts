import { isEven } from "../utils/number.ts";

export const solvePart1 = (input: string) => {
  const values = input.split(" ").map(Number);
  const root = [];

  let count = 0;
  for (const value of values) {
    const node = new BinaryTreeNode(value);
    count += blink(node, 25);
    root.push(node);
  }

  return count;
};

export const solvePart2 = (input: string) => {
  return 0;
};

/**
 * Return amount of leaves in the tree
 * @param node
 * @param maxAmountBlinks
 * @param previousAmountBlinks
 * @returns
 */
const blink = (
  node: BinaryTreeNode,
  maxAmountBlinks: number,
  previousAmountBlinks: number = 0
): number => {
  if (previousAmountBlinks === maxAmountBlinks) {
    return 1;
  }

  if (node.value === 0) {
    node.left = new BinaryTreeNode(1);
    node.right = null;
    return blink(node.left, maxAmountBlinks, previousAmountBlinks + 1);
  }

  const digitAsString = String(node.value);
  if (isEven(digitAsString.length)) {
    const halfway = digitAsString.length / 2;
    const [leftStr, rightStr] = [
      digitAsString.slice(0, halfway),
      digitAsString.slice(halfway),
    ];
    node.left = new BinaryTreeNode(Number(leftStr));
    node.right = new BinaryTreeNode(Number(rightStr));
    return (
      blink(node.left, maxAmountBlinks, previousAmountBlinks + 1) +
      blink(node.right, maxAmountBlinks, previousAmountBlinks + 1)
    );
  }

  node.left = new BinaryTreeNode(node.value * 2024);

  return blink(node.left, maxAmountBlinks, previousAmountBlinks + 1);
};

class BinaryTreeNode {
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  parent: BinaryTreeNode | null;

  constructor(value: number, parent: BinaryTreeNode | null = null) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = parent;
  }
}
