import { NodeTypes, StoryNode } from '@mcesystems/reflow-story/dist/types'
import * as React from 'react'


export const StoryNodesStoreProvider = React.createContext([] as StoryNode<NodeTypes>[])