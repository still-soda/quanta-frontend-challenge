<template>
   <TTag size="small" :style="{ backgroundColor: color, color: '#fff' }">
      <slot></slot>
   </TTag>
</template>

<script setup lang="ts">
defineProps<{ color: string }>();
</script>
