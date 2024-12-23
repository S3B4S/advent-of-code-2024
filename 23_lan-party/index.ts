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

  const markPerNode = new Map<string, MarkId>();
  const markedFields = new Map<MarkId, GraphNode[]>();

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

      // Edge is between 2 completely new nodes
      if (!markPerNode.has(fstNode.name) && !markPerNode.has(sndNode.name)) {
        const markId = `${fstNode.name}-${sndNode.name}` as MarkId;

        markPerNode.set(fstNode.name, markId);
        markPerNode.set(sndNode.name, markId);

        markedFields.set(markId, [fstNode, sndNode]);
      }

      // One of the nodes is in the markedFIelds, the other is not
      if (
        (markPerNode.has(fstNode.name) && !markPerNode.has(sndNode.name)) ||
        (markPerNode.has(sndNode.name) && !markPerNode.has(fstNode.name))
      ) {
        const [alreadyMarkedNode, newNode] = markPerNode.has(fstNode.name)
          ? [fstNode, sndNode]
          : [sndNode, fstNode];

        const markId = markPerNode.get(alreadyMarkedNode.name)!;
        const allMarkedNodes = markedFields.get(markId)!;

        // Check if the new incoming node has an edge to all marked nodes
        if (
          allMarkedNodes.every((markedNode) =>
            markedNode.outgoing.some((node) => node.name === newNode.name)
          )
        ) {
          // If so, we can add the new node to the markedFields
          markedFields.set(markId, [...allMarkedNodes, newNode]);
          markPerNode.set(newNode.name, markId);
        }
      }

      // Both nodes are already marked, need to check if we need to merge them
      if (markPerNode.has(fstNode.name) && markPerNode.has(sndNode.name)) {
        const markId1 = markPerNode.get(fstNode.name)!;
        const markId2 = markPerNode.get(sndNode.name)!;

        const field1 = markedFields.get(markId1)!;
        const field2 = markedFields.get(markId2)!;

        const isAllConnected = field1?.every((node1) => {
          return field2?.every((node2) =>
            node2.outgoing.some(
              (outgoingNode) => outgoingNode.name === node1.name
            )
          );
        });

        if (isAllConnected) {
          markedFields.set(markId1, [...field1, ...field2]);
          markedFields.delete(markId2);

          field2.forEach((node) => {
            markPerNode.set(node.name, markId1);
          });
        }
      }
    });

  // console.log(markedFields);

  return markedFields
    .entries()
    .reduce(
      (acc: [MarkId, GraphNode[]], markedField: [MarkId, GraphNode[]]) => {
        return acc[1].length > markedField[1].length ? acc : markedField;
      }
    )[1]
    .map((node) => node.name)
    .toSorted()
    .join(",");
};
