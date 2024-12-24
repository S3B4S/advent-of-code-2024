import { HashSet } from "../utils/hashSet.ts";

class GraphNode {
  name: string;
  value?: number;
  outgoing: GraphNode[];

  constructor(name: string, value?: number, outgoing: GraphNode[] = []) {
    this.name = name;
    this.value = value;
    this.outgoing = outgoing;
  }

  addUndirectedNeighbour(node: GraphNode) {
    this.outgoing.push(node);
    node.outgoing.push(this);
  }
}

export const solvePart1 = (input: string) => {
  const nodes = new Map<string, GraphNode>();
  const startNodes = [] as GraphNode[];

  input
    .trim()
    .split("\n")
    .forEach((line) => {
      const [_, fst, snd] = line.match(/^(\w+)-(\w+)$/) ?? [];

      if (!nodes.get(fst)) nodes.set(fst, new GraphNode(fst));
      if (!nodes.get(snd)) nodes.set(snd, new GraphNode(snd));

      const fstNode = nodes.get(fst)!;
      const sndNode = nodes.get(snd)!;

      fstNode.addUndirectedNeighbour(sndNode);

      if (
        fstNode.name.startsWith("t") &&
        !startNodes.find((node) => node.name === fstNode.name)
      ) {
        startNodes.push(fstNode);
      }

      if (
        sndNode.name.startsWith("t") &&
        !startNodes.find((node) => node.name === sndNode.name)
      ) {
        startNodes.push(sndNode);
      }
    });

  const circularPaths = new HashSet<GraphNode[]>((nodes) =>
    nodes.map((node) => node.name).join(",")
  );

  startNodes.forEach((startNode) => {
    // Do a BFS with a maximum depth of 2, and if the node at depth 2 is the start node, add it to circularPaths
    const queue = [{ node: startNode, depth: 0, path: [] }] as {
      node: GraphNode;
      depth: number;
      path: GraphNode[];
    }[];
    const visited = new HashSet<{ node: GraphNode; depth: number }>(
      ({ node, depth }) => `${node.name}-${depth}`
    );
    visited.include({ node: startNode, depth: 0 });

    while (queue.length > 0) {
      const { node, depth, path } = queue.shift()!;
      visited.include({ node, depth });

      node.outgoing.forEach((outgoing) => {
        if (outgoing.name === startNode.name && depth === 2) {
          circularPaths.include(
            [...path, node].toSorted((a, b) => a.name.localeCompare(b.name))
          );
        }

        if (depth > 2) return;
        queue.push({
          node: outgoing,
          depth: depth + 1,
          path: [...path, node],
        });
      });
    }
  });

  return circularPaths.size;
};

type MarkId = string;

export const solvePart2 = (input: string) => {
  const nodes = new Map<string, GraphNode>();

  input
    .trim()
    .split("\n")
    .forEach((line) => {
      const [_, fst, snd] = line.match(/^(\w+)-(\w+)$/) ?? [];

      if (!nodes.get(fst)) nodes.set(fst, new GraphNode(fst));
      if (!nodes.get(snd)) nodes.set(snd, new GraphNode(snd));

      const fstNode = nodes.get(fst)!;
      const sndNode = nodes.get(snd)!;

      fstNode.addUndirectedNeighbour(sndNode);
    });

  const candidates = [] as GraphNode[][];
  const skipChecking = new Set<string>();
  for (const node of [...nodes.values()].toSorted(
    (a, b) => b.outgoing.length - a.outgoing.length
  )) {
    if (node.outgoing.length < 8) continue;
    if (skipChecking.has(node.name)) continue;
    const biggestClique = detectCliqueRec([node]);
    console.log(biggestClique.length);
    candidates.push(biggestClique);
    for (const node of biggestClique) {
      skipChecking.add(node.name);
    }
    if (biggestClique.length > 7) break;
  }

  return candidates
    .reduce((acc, curr) => {
      return acc.length > curr.length ? acc : curr;
    })
    .map((node) => node.name)
    .toSorted()
    .join(",");
};

const detectCliqueRec = (nodes: GraphNode[]): GraphNode[] => {
  const candidates = [];
  const nodeIds = new Set(nodes.map((node) => node.name));
  for (const candidate of nodes[0].outgoing) {
    if (
      new Set(candidate.outgoing.map((node) => node.name)).isSupersetOf(nodeIds)
    ) {
      candidates.push(detectCliqueRec([...nodes, candidate]));
    }
  }

  if (candidates.length === 0) return nodes;

  return candidates.reduce((acc, curr) => {
    return acc.length > curr.length ? acc : curr;
  });
};
