<template>
   <div
      class="flex flex-col items-center px-4 py-2 rounded-md border-[1px] border-gray-700 bg-white shadow-md">
      <Handle
         v-if="terminal !== 'source'"
         id="left"
         :connectable="1"
         :position="Position.Left" />
      <div
         class="flex flex-col gap-1"
         :class="{ 'pointer-events-none': readonly }">
         <slot name="head"></slot>
         <slot></slot>
      </div>
      <Handle
         v-if="terminal !== 'target'"
         id="right"
         :connectable="1"
         :position="Position.Right" />
   </div>
</template>

<script setup lang="ts">
import { Handle, Position, useVueFlow } from '@vue-flow/core';
import { inject } from 'vue';

const { onConnect, addEdges } = useVueFlow();
onConnect((connection) => {
   addEdges({
      ...connection,
      animated: true,
   });
});

defineProps<{
   terminal: 'both' | 'source' | 'target';
}>();

const readonly = !!inject<boolean>('readonly');
</script>

<style scoped></style>
