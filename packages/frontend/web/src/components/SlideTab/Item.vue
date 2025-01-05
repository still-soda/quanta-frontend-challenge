<template>
   <div
      @click="onClick"
      class="relative h-full w-full rounded-[0.75rem] hover:cursor-pointer flex items-center justify-center">
      <slot :active="active"></slot>
   </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';

const active = ref(false);
const index = ref(-1);
const toggleActive = inject('toggleActive') as (index: number) => void;
const registerCeil = inject('registerCeil') as (ceil: any) => void;

if (!registerCeil || !toggleActive) {
   throw new Error('SlideTabCeil 组件必须在 SlideTabContainer 组件内部');
} else {
   registerCeil({ active, index });
}

function onClick() {
   active.value = !active.value;
   toggleActive(index.value);
}

defineExpose({ active, index });
</script>
