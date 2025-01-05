<template>
   <div
      class="text-xs px-[0.8em] py-[0.1em] tracking-wide rounded-[0.4rem] font-medium text-[0.6rem] w-fit h-fit shrink-0"
      :class="TagColors[props.type ?? 'primary']">
      <slot></slot>
   </div>
</template>

<script setup lang="ts">
import { TagType, TagColors } from './index.types';

const props = defineProps<{
   type?: TagType;
}>();
</script>
