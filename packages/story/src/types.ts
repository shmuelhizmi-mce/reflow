import { ReducedViewTree, ViewsMapInterface } from "@mcesystems/reflow";

export enum NodeTypes {
  StoryStart,
  FlowStart,
  Log,
  Decision,
  Expect,
  DeadEnd,
  Crash,
}

export enum Colors {
  Success,
  Info,
  Warn,
  Error,
  Crash,
}

export enum CrashType {
  FalseExpect,
  CodeCrash,
}

export type MessageData = { message: string; color: Colors };
export type FlowData = { flowColor: string };
export type ExpectData = { expectData: string; actualData: string; equals: boolean; };
export type CrashData = { crashType: CrashType; error: Error };

export interface NodeData extends Record<NodeTypes, object> {
  [NodeTypes.StoryStart]: MessageData;
  [NodeTypes.Decision]: MessageData;
  [NodeTypes.DeadEnd]: MessageData;
  [NodeTypes.Log]: MessageData;
  [NodeTypes.FlowStart]: MessageData & FlowData;
  [NodeTypes.Expect]: MessageData & ExpectData;
  [NodeTypes.Crash]: MessageData & CrashData;
}

export type StoryNode<Type extends NodeTypes> = {
  id: string;
  parentId: string;
  flowParentId: string;
  type: Type;
  data: NodeData[Type];
};

export type StoryViewSnapshot<ViewsMap extends ViewsMapInterface> = {
  nodeId: string;
  viewTree: ReducedViewTree<ViewsMap>;
};
