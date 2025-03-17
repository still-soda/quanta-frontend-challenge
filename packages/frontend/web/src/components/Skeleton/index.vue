<template>
   <div
      v-if="!type || type === 'text'"
      class="transition-all w-fit duration-200 text-wrap"
      :class="{
         'animate-pulse bg-gray-300 rounded-md text-transparent pointer-events-none':
            !hiden,
         '!bg-transparent absolute top-0': disabled,
      }">
      <div :class="{ 'opacity-0': !hiden }">
         <slot></slot>
      </div>
   </div>
</template>

<script setup lang="ts">
defineProps<{
   type?: 'text' | 'rect' | 'circle';
   disabled?: boolean;
   hiden?: boolean;
}>();
</script>

<style scoped></style>
