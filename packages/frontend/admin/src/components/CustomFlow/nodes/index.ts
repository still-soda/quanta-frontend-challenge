import MOUSE_FLOW_NODES from './mouse-flow-nodes';
import TRIGGER_FLOW_NODES from './trigger-flow-nodes';
import TESTPOINT_FLOW_NODES from './testpoint-flow-nodes';
import TERMINAL_FLOW_NODES from './terminal-flow-nodes';

export const CUSTOM_FLOW_NODES = {
   ...MOUSE_FLOW_NODES,
   ...TRIGGER_FLOW_NODES,
   ...TESTPOINT_FLOW_NODES,
   ...TERMINAL_FLOW_NODES,
};

export const CUSTOM_FLOW_NODE_TYPES = Object.keys(
   CUSTOM_FLOW_NODES
) as (keyof typeof CUSTOM_FLOW_NODES)[];
