import { markRaw } from 'vue';
import StartFlowNode from './StartFlowNode.vue';
import EndFlowNode from './EndFlowNode.vue';

const TERMINAL_FLOW_NODES = {
   'terminal:start': markRaw(StartFlowNode),
   'terminal:end': markRaw(EndFlowNode),
};

export default TERMINAL_FLOW_NODES;
