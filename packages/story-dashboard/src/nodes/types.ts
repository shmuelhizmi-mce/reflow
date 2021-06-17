import { NodeTypes, StoryNode } from "@mcesystems/reflow-story/dist/types";
import { INode } from "@mrblenny/react-flow-chart";

export type HandlerPropsType<Type extends NodeTypes> = {
  node: StoryNode<Type>;
  graphNode: INode;
};

export type HandlerType<Type extends NodeTypes> = (props: HandlerPropsType<Type>) => JSX.Element;
