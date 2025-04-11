import { markRaw } from 'vue';
import ClickMouseNode from './ClickMouseNode.vue';
import MoveMouseNode from './MoveMouseNode.vue';
import ScrollMouseNode from './ScrollMouseNode.vue';

const MOUSE_FLOW_NODES = {
   'mouse:click': markRaw(ClickMouseNode),
   'mouse:move': markRaw(MoveMouseNode),
   'mouse:scroll': markRaw(ScrollMouseNode),
};

export default MOUSE_FLOW_NODES;
