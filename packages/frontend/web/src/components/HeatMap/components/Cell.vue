<template>
   <div
      class="size-[0.875rem] rounded-[0.2rem] shrink-0 bg-blue-ex-low"
      :class="{
         'bg-orange-low': props.level === 'low',
         'bg-orange-mid': props.level === 'mid',
         'bg-orange-high': props.level === 'high',
      }"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
   level: 'none' | 'low' | 'mid' | 'high';
}>();
</script>

<style scoped></style>
