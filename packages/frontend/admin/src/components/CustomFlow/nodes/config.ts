import MOUSE_FLOW_CONFIG from './mouse-flow-nodes/config';
import TESTPOINT_FLOW_CONFIG from './testpoint-flow-nodes/config';
import TRIGGER_FLOW_CONFIG from './trigger-flow-nodes/config';

export interface FlowConfig {
   [key: string]: {
      title: string;
      icon: string;
   };
}

const flowConfig = {
   ...MOUSE_FLOW_CONFIG,
   ...TESTPOINT_FLOW_CONFIG,
   ...TRIGGER_FLOW_CONFIG,
} satisfies FlowConfig;

export default flowConfig;
