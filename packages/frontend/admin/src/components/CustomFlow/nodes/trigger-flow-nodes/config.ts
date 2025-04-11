import { FlowConfig } from '../config';

const TRIGGER_FLOW_CONFIG = {
   'trigger:blur': {
      title: '失焦',
      icon: 'center-focus-strong',
   },
   'trigger:drag': {
      title: '拖拽',
      icon: 'drag-drop',
   },
   'trigger:focus': {
      title: '聚焦',
      icon: 'focus',
   },
   'trigger:input': {
      title: '输入',
      icon: 'keyboard',
   },
   'trigger:hover': {
      title: '悬停',
      icon: 'gesture-press',
   },
   'trigger:wait': {
      title: '等待',
      icon: 'time',
   },
} satisfies FlowConfig;

export default TRIGGER_FLOW_CONFIG;
