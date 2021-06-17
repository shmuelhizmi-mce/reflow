// from https://github.com/MrBlenny/react-flow-chart/blob/master/stories/CustomCanvasOuter.tsx

import { ICanvasOuterDefaultProps } from "@mrblenny/react-flow-chart";
import styled from "styled-components";

export const CanvasOuter = styled.div<ICanvasOuterDefaultProps>`
  position: relative;
  background-size: 10px 10px;
  background-color: #4f6791;
  background-image: linear-gradient(
      90deg,
      hsla(0, 0%, 100%, 0.1) 1px,
      transparent 0
    ),
    linear-gradient(180deg, hsla(0, 0%, 100%, 0.1) 1px, transparent 0);
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: not-allowed;
` as any;
