import * as React from "react";
import { useReader } from "./hooks/useReader";
import { FlowChart, actions, IChart } from "@mrblenny/react-flow-chart";
import { Socket } from "@mcesystems/reflow-story/src/transport/types";
import * as merge from "lodash.merge";

export function Dashboard(socket: Socket) {
  const { links, nodes } = useReader(socket);
  const [chartState, setChartState] = React.useState<IChart>({
    hovered: {},
    selected: {},
    offset: { x: 0, y: 0 },
    scale: 1,
    links,
    nodes,
  });
  React.useEffect(() => {
    merge(chartState, { links, nodes });
    setChartState({ ...chartState });
  }, [links, nodes]);
  return (
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
    />
  );
}
