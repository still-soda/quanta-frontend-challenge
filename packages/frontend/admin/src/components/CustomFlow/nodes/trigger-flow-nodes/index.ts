import { markRaw } from 'vue';
import BlurTriggerNode from './BlurTriggerNode.vue';
import DragTriggerNode from './DragTriggerNode.vue';
import FocusTriggerNode from './FocusTriggerNode.vue';
import HoverTriggerNode from './HoverTriggerNode.vue';
import InputTriggerNode from './InputTriggerNode.vue';
import WaitTriggerNode from './WaitTriggerNode.vue';

const TRIGGER_FLOW_NODES = {
   'trigger:blur': markRaw(BlurTriggerNode),
   'trigger:drag': markRaw(DragTriggerNode),
   'trigger:focus': markRaw(FocusTriggerNode),
   'trigger:hover': markRaw(HoverTriggerNode),
   'trigger:input': markRaw(InputTriggerNode),
   'trigger:wait': markRaw(WaitTriggerNode),
};

export default TRIGGER_FLOW_NODES;
