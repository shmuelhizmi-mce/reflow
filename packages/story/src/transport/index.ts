import { ViewsMapInterface } from "@mcesystems/reflow";
import { Socket, TransportEvents } from "./types";
import { NodeTypes, StoryNode, StoryViewSnapshot } from "../types";

export function createWriteTransport<ViewsMap extends ViewsMapInterface = any>(
  connection: Socket
) {
  const { call, on } = connection as Socket<TransportEvents<ViewsMap>>;
  const nodes: {
    baseNode: StoryNode<NodeTypes>;
    viewData: StoryViewSnapshot<ViewsMap>;
  }[] = [];
  on("requestAllNodes", () =>
    call(
      "updateNodeTree",
      nodes.map((node) => node.baseNode)
    )
  );
  on("requestNodeViewData", ({ nodeId }) => {
    const viewData = nodes.find(
      (node) => node.viewData.nodeId === nodeId
    )?.viewData;
    if (viewData) {
      call("updateViewData", viewData);
    }
  });
  const self = {
    write<Type extends NodeTypes>(
      node: StoryNode<Type>,
      viewSnapshot: StoryViewSnapshot<ViewsMap>
    ) {
      nodes.push({ baseNode: node, viewData: viewSnapshot });
      call("updateNodeTree", [node]);
    },
  };
  return self;
}

export function createReadTransport<ViewsMap extends ViewsMapInterface = any>(
  connection: Socket
) {
  const { call, on } = connection as Socket<TransportEvents<ViewsMap>>;
  const nodeUpdateListeners = new Set<
    (nodes: StoryNode<NodeTypes>[]) => void
  >();
  // [nodeId]: Node
  const nodes = new Map<string, StoryNode<NodeTypes>>();
  const getNodes = () => Array.from(nodes.values());
  on("updateNodeTree", (newNodes) => {
    newNodes.forEach((node) => {
      nodes[node.id] = node;
    });
    nodeUpdateListeners.forEach((listener) => listener(getNodes()));
  });
  call("requestAllNodes", null);
  return {
    getNodes,
    onUpdate(listener: (nodes: StoryNode<NodeTypes>[]) => void) {
      nodeUpdateListeners.add(listener);
    },
  };
}

export type Reader = ReturnType<typeof createReadTransport>;

export type Writer = ReturnType<typeof createWriteTransport>;
