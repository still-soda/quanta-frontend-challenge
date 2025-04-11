<template>
   <BasicNode terminal="target" class="!rounded-full">
      <div class="flex flex-col my-2 gap-2">
         <div
            class="size-16 flex flex-col gap-1.5 items-center justify-center font-semibold text-gray-600">
            <TIcon name="doge" class="size-6" />
            <div>判题结束</div>
         </div>
      </div>
   </BasicNode>
</template>

<script setup lang="ts">
import { NodeProps, useNode } from '@vue-flow/core';
import BasicNode from '../BasicNode.vue';
import { watchEffect } from 'vue';
import { TerminalData } from './terminal-data.type';

defineProps<NodeProps<TerminalData>>();

const node = useNode<TerminalData>().node;

watchEffect(() => {
   if (node) {
      node.data = { terminal: 'end' };
   }
});
</script>
