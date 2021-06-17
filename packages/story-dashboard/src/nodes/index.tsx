import { INode, INodeInnerDefaultProps } from "@mrblenny/react-flow-chart";
import * as React from "react";
import { StoryNodesStoreProvider } from "./provider";
import { NodeTypes, StoryNode } from "@mcesystems/reflow-story/dist/types";
import { HandlerType } from "./types";
import { NodeBase } from "./baseNode";


const nodeHandlers: { [Type in NodeTypes]: HandlerType<Type> } = {
	[NodeTypes.Crash]: NodeBase,
	[NodeTypes.DeadEnd]: NodeBase,
	[NodeTypes.Decision]: NodeBase,
	[NodeTypes.Expect]: NodeBase,
	[NodeTypes.FlowStart]: NodeBase,
	[NodeTypes.Log]: NodeBase,
	[NodeTypes.StoryStart]: NodeBase,
};

export function NodeInner({ node }: INodeInnerDefaultProps) {
  const storyNodes = React.useContext(StoryNodesStoreProvider);
  const currentNode = storyNodes.find(
    (currentNode) => currentNode.id === node.id
  );
  const returnError = (message: string) => (
    <div style={{ color: "red" }}>{message}</div>
  );

  if (!currentNode) {
    return returnError("ERROR - unknown node type");
  }
  const Handler = nodeHandlers[currentNode.type] as HandlerType<NodeTypes>;
  if (!Handler) {
    return returnError("ERROR - missing node type implementation");
  }
  return <Handler node={currentNode} graphNode={node} />;
}
