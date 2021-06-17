import * as React from "react";
import { useReader } from "./hooks/useReader";
import {
  FlowChart,
  actions,
  IChart,
  INodeDefaultProps,
} from "@mrblenny/react-flow-chart";
import { Socket } from "@mcesystems/reflow-story/dist/transport/types";
import { StoryNodesStoreProvider } from "./nodes/provider";
import * as merge from "lodash.merge";
import { NodeInner } from "./nodes";
import { CanvasOuter } from "./canvas";

const Node = React.forwardRef<HTMLDivElement, INodeDefaultProps>(
  ({ children, style, ...otherProps }, ref) => (
    <div ref={ref} style={{ ...style, position: "absolute" }} {...otherProps}>
      {children}
    </div>
  )
);

export function Dashboard(socket: Socket) {
  const { links, nodes, storyNodes } = useReader(socket);
  const [chartState, setChartState] = React.useState<IChart>({
    hovered: {},
    selected: {},
    offset: { x: 400, y: 200 },
    scale: 0.5,
    links,
    nodes,
  });
  React.useEffect(() => {
    const newChart = merge({ links, nodes }, chartState);
    setChartState(newChart);
  }, [links, nodes]);
  return (
    <StoryNodesStoreProvider.Provider value={storyNodes}>
      <FlowChart
        callbacks={Object.entries(actions).reduce(
          (actions, [actionsName, actor]) => {
            actions[actionsName] = (...args) => {
              (actor as any)(...args)(chartState);
              setChartState({ ...chartState });
            };
            return actions;
          },
          { ...actions }
        )}
        chart={{
          hovered: {},
          links,
          nodes,
          ...chartState,
        }}
		config={{ readonly: true }}
        Components={{
          NodeInner: NodeInner,
          Node,
		  CanvasOuter: CanvasOuter,
        }}
      />
    </StoryNodesStoreProvider.Provider>
  );
}
