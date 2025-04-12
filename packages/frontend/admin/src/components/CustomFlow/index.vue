<template>
   <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      class="h-full"
      :node-types="CUSTOM_FLOW_NODES">
      <Background pattern-color="#aaa" :gap="12" />
      <Controls />
   </VueFlow>
</template>

<script setup lang="ts">
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';

import { Edge, Node, useVueFlow, VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { nextTick, provide, ref, watchEffect } from 'vue';
import { CUSTOM_FLOW_NODES } from './nodes';
import { useFlowBuilder } from './hooks/use-flow-builder.hook';
import { useLayout } from './hooks/use-layout.hook';
import { FlowData } from '@challenge/core';

defineOptions({
   name: 'CustomFlow',
});

const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
const { buildFlowData, destructureFlowData } = useFlowBuilder();

// 更新生成结果
const flowData = defineModel<FlowData[]>('flowData');
watchEffect(() => {
   try {
      const result = buildFlowData(nodes.value, edges.value);
      flowData.value = result;
   } catch (error) {}
});

const props = defineProps<{
   readonly?: boolean;
}>();

// 流程图设置
const { nodesDraggable, zoomOnDoubleClick } = useVueFlow();
nodesDraggable.value = !props.readonly;
zoomOnDoubleClick.value = false;

// 注入只读状态
provide('readonly', !!props.readonly);

const { layout } = useLayout();

// 暴露更新方法
const updateFlowData = (flowdataStr: string) => {
   try {
      const flowdata = JSON.parse(flowdataStr);
      const result = destructureFlowData(flowdata);
      nodes.value = result.nodes;
      edges.value = result.edges;
      nextTick(() => {
         const stop = layout();
         setTimeout(stop, 100);
      });
   } catch (error) {
      console.error('Invalid flow data format');
   }
};
defineExpose({
   updateFlowData,
});
</script>

<style>
.vue-flow__handle {
   border-radius: 4px;
   width: 12px;
   height: 24px;
   transition: 0.2s;
}
</style>
