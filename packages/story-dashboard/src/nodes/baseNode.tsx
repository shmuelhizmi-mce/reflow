import { Colors, NodeTypes } from "@mcesystems/reflow-story/dist/types";
import * as React from "react";
import { HandlerPropsType, HandlerType } from "./types";

export const colorMap: { [Color in Colors]: string } = {
  [Colors.Crash]: "red",
  [Colors.Error]: "orangered",
  [Colors.Info]: "white",
  [Colors.Success]: "green",
  [Colors.Warn]: "lightyellow",
};

function getFlowColor(flowID: string): string {
  function hashCode(str) {
    // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function intToRGB(i) {
    var c = (i & 0x00ffffff).toString(16).toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }
  return "#" + intToRGB(hashCode(flowID));
}

export const borderRadiusMap: { [Type in NodeTypes]: number | string } = {
  [NodeTypes.Crash]: 0,
  [NodeTypes.DeadEnd]: 2,
  [NodeTypes.Log]: 8,
  [NodeTypes.FlowStart]: "10%",
  [NodeTypes.DeadEnd]: "10%",
  [NodeTypes.StoryStart]: "10%",
  [NodeTypes.Expect]: "20%",
  [NodeTypes.Decision]: "45%",
};

export function NodeBase(props: HandlerPropsType<NodeTypes>) {
  const { graphNode, node } = props;

  return (
    <div
      style={{
        minHeight: 125,
        minWidth: 250,
        maxWidth: 300,
        maxHeight: 200,
        borderRadius: borderRadiusMap[node.type],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontSize: 28,
        fontWeight: 700,
        color: "black",
        border: `3px dotted ${getFlowColor(node.flowParentId)}`,
        // boxShadow: `inset ${colorMap[node.data.color]} 0px 7px 13px 0px`,
        backgroundColor: colorMap[node.data.color],
      }}
    >
      <div style={{ padding: 25 }}>{node.data.message}</div>
    </div>
  );
}
