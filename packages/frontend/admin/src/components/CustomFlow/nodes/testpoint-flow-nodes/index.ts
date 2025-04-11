import { markRaw } from 'vue';
import ExpectTestpointNode from './ExpectTestpointNode.vue';
import ScreenshotTestpointNode from './ScreenshotTestpointNode.vue';

const TESTPOINT_FLOW_NODES = {
   'testpoint:expect': markRaw(ExpectTestpointNode),
   'testpoint:screenshot': markRaw(ScreenshotTestpointNode),
};

export default TESTPOINT_FLOW_NODES;
