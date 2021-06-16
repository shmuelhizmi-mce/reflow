import { v4 as uuid } from "uuid";
import { StoryNode, NodeTypes, NodeData, Colors, CrashType } from "../types";
import { Writer } from "../transport";

export class Node<Type extends NodeTypes> implements StoryNode<Type> {
  public readonly id: string;
  public readonly parentId: string;
  public readonly flowParentId: string;
  public readonly type: Type;
  public readonly data: NodeData[Type];
  constructor(self: StoryNode<Type>, private writer: Writer) {
    this.id = self.id;
    this.parentId = self.parentId;
    this.flowParentId = self.flowParentId;
    this.type = self.type;
    this.data = self.data;
    this.writer.write(this, { nodeId: this.id, viewTree: [] });
  }
  static story(name: string, writer: Writer) {
    const id = uuid();
    return new Node<NodeTypes.StoryStart>(
      {
        data: {
          message: name,
          color: Colors.Success,
        },
        id,
        flowParentId: id,
        parentId: id,
        type: NodeTypes.StoryStart,
      },
      writer
    );
  }
  expect(message: string, expectData: string, actualData: string, areTheyEqual: boolean) {
	const id = uuid();
    return new Node<NodeTypes.Expect>(
      {
        id,
        flowParentId: this.flowParentId,
        parentId: this.id,
        type: NodeTypes.Expect,
        data: {
          message,
		  expectData,
		  actualData,
		  equals: areTheyEqual,
		  color: Colors.Info,
        },
      },
      this.writer
    );
  }
  throw(crashType: CrashType, error: Error) {
    const id = uuid();
    return new Node<NodeTypes.Crash>(
      {
        id,
        flowParentId: this.flowParentId,
        parentId: this.id,
        type: NodeTypes.Crash,
        data: {
          message: error.name,
          color: Colors.Crash,
          crashType,
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack,
          },
        },
      },
      this.writer
    );
  }
  decision(name: string) {
    const id = uuid();
    return new Node<NodeTypes.Decision>(
      {
        id,
        flowParentId: this.flowParentId,
        parentId: this.id,
        type: NodeTypes.Decision,
        data: {
          color: Colors.Success,
          message: name,
        },
      },
      this.writer
    );
  }
  flow(message: string) {
    const id = uuid();
    return new Node<NodeTypes.FlowStart>(
      {
        id,
        flowParentId: id,
        parentId: this.id,
        type: NodeTypes.FlowStart,
        data: {
          color: Colors.Success,
          message,
          flowColor: Math.floor(Math.random() * 16777215).toString(16),
        },
      },
      this.writer
    );
  }
  write(color: Colors, message: string) {
    const id = uuid();
    return new Node<NodeTypes.Log>(
      {
        id,
        flowParentId: this.flowParentId,
        parentId: this.id,
        type: NodeTypes.Log,
        data: {
          color,
          message,
        },
      },
      this.writer
    );
  }
  info(message: string) {
    return this.write(Colors.Info, message);
  }
  warn(message: string) {
    return this.write(Colors.Warn, message);
  }
  error(message: string) {
    return this.write(Colors.Error, message);
  }
  toJSON(): StoryNode<Type> {
    return {
      data: this.data,
      id: this.id,
      parentId: this.parentId,
      flowParentId: this.flowParentId,
      type: this.type,
    };
  }
}
