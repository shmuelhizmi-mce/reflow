import { useEffect, useState } from "react";
import { createReadTransport } from "@mcesystems/reflow-story/dist/transport";
import { Socket } from "@mcesystems/reflow-story/dist/transport/types";
import { NodeTypes, StoryNode } from "@mcesystems/reflow-story/dist/types";
import { IChart, ILink, IPort } from "@mrblenny/react-flow-chart";

const nodeXGap = 600;
const nodeYGap = 350;

type NodeTree = {
  self: StoryNode<NodeTypes>;
  children: NodeTree[];
  parent?: NodeTree;
};

type NodeTreeWithPosition = {
  self: StoryNode<NodeTypes>;
  parent?: NodeTreeWithPosition;
  children: NodeTreeWithPosition[];
  position: {
    x: number;
    y: number;
  };
};

function createNodeTree(
  nodes: StoryNode<NodeTypes>[],
  currentNode: StoryNode<NodeTypes>
): NodeTree {
  nodes.splice(nodes.indexOf(currentNode), 1);
  const children = nodes
    .filter(
      (currentNodeToCompare) => currentNodeToCompare.parentId === currentNode.id
    )
    .map((child) => createNodeTree(nodes, child));
  return {
    self: currentNode,
    children,
  };
}

function addPositionToTree(
  level: NodeTree[],
  height = 0
): NodeTreeWithPosition[] {
  level.forEach((item, index) => {
    const itemWithPosition = item as NodeTreeWithPosition;
    let xBase = 0;
    if (itemWithPosition.parent) {
      xBase =
        itemWithPosition.parent.position.x +
        itemWithPosition.parent.children.indexOf(itemWithPosition) * nodeXGap;
    }
    itemWithPosition.position = {
      x: Math.max(index * nodeXGap, xBase),
      y: height * nodeYGap,
    };
    itemWithPosition.children.forEach((child) => {
      child.parent = itemWithPosition;
    });
  });
  if (level.length > 0) {
    addPositionToTree(
      level.reduce((nodeTrees: NodeTree[], currentTree: NodeTree) => {
        return [...nodeTrees, ...currentTree.children];
      }, []),
      height + 1
    );
  }
  return level as NodeTreeWithPosition[];
}

function mapNodeTreeToChart(
  children: NodeTreeWithPosition[]
): Pick<IChart, "links" | "nodes"> {
  return children.reduce(
    (chart, tree) => {
      const { id, parentId } = tree.self;

      const childPorts = tree.children.reduce((ports, child) => {
        const portId = `${id}-${child.self.id}`;
        ports[portId] = {
          id: portId,
          type: "output",
        };
        return ports;
      }, {} as Record<string, IPort>);

      const selfPortId = `${parentId}-${id}`;
      const selfPort: IPort = {
        id: selfPortId,
        type: "input",
      };

      chart.nodes[id] = {
        id,
        position: tree.position,
        ports: { ...childPorts, [selfPortId]: selfPort },
        type: id !== parentId ? "input-output" : "output-only",
      };

      const selfLink: ILink = {
        from: {
          nodeId: parentId,
          portId: selfPortId,
        },
        to: {
          nodeId: id,
          portId: selfPortId,
        },
        id: selfPortId,
      };

      chart.links[`${selfPortId}-input`] = selfLink;

      const { links: childLinks, nodes: childNodes } = mapNodeTreeToChart(
        tree.children
      );

      Object.assign(chart.links, childLinks);
      Object.assign(chart.nodes, childNodes);

      return chart;
    },
    { links: {}, nodes: {} } as Pick<IChart, "links" | "nodes">
  );
}

export function useReader(socket: Socket) {
  const [nodes, setNodes] = useState<StoryNode<NodeTypes>[]>([]);
  const [chart, setChart] = useState<Pick<IChart, "links" | "nodes">>({
    links: {},
    nodes: {},
  });
  useEffect(() => {
    const reader = createReadTransport(socket);
    reader.onUpdate((newNodes) => setNodes(newNodes));
  }, []);
  useEffect(() => {
    const root = nodes.find(
      (currentNode) => currentNode.id === currentNode.parentId
    );
    if (root) {
      const nodeTree = createNodeTree([...nodes], root);
      const nodeTreeWithPositions = addPositionToTree([nodeTree]);

      setChart(mapNodeTreeToChart(nodeTreeWithPositions));
    }
  }, [nodes]);

  return { ...chart, storyNodes: nodes };
}
