import { FlowConfig } from '../config';

const MOUSE_FLOW_CONFIG = {
   'mouse:click': {
      title: '点击鼠标',
      icon: 'gesture-click',
   },
   'mouse:move': {
      title: '移动鼠标',
      icon: 'move-1',
   },
   'mouse:scroll': {
      title: '滚动滚轮',
      icon: 'scroll-bar',
   },
} satisfies FlowConfig;

export default MOUSE_FLOW_CONFIG;
