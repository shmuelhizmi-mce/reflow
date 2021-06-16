import { ViewsMapInterface } from "@mcesystems/reflow";
import { StoryNode, NodeTypes, StoryViewSnapshot } from "../types";

export interface TransportEvents<ViewsMap extends ViewsMapInterface = any> {
  updateNodeTree: StoryNode<NodeTypes>[];
  requestAllNodes: void;
  requestNodeViewData: { nodeId: string };
  updateViewData: StoryViewSnapshot<ViewsMap>;
}

export type Socket<Events extends Record<string, any> = Record<string, any>> = {
  on<EventName extends keyof Events>(
    message: EventName,
    handler: (data: Events[EventName]) => void
  ): Socket;
  call<EventName extends keyof Events>(
    message: EventName,
    data: Events[EventName]
  ): Socket;
};
