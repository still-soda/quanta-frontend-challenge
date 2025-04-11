import { FlowConfig } from '../config';

const TESTPOINT_FLOW_CONFIG = {
   'testpoint:expect': {
      title: '期望测试',
      icon: 'gesture-pray',
   },
   'testpoint:screenshot': {
      title: '截图测试',
      icon: 'screenshot',
   },
} satisfies FlowConfig;

export default TESTPOINT_FLOW_CONFIG;
