<template>
   <div
      class="w-[1fr] h-[1fr] py-[1.19rem] px-[1.62rem] bg-white shadow-outside rounded-outside flex gap-[0.44rem] flex-col">
      <div class="flex justify-between">
         <slot name="title" :title="props.title" v-if="!noHeader">
            <h1
               class="font-bold text-md bg-gradient-to-r from-dark-from to-dark-to bg-clip-text text-transparent">
               {{ props.title ?? '无标题' }}
            </h1>
         </slot>
         <slot name="extra"></slot>
      </div>
      <slot></slot>
   </div>
</template>

<script setup lang="ts">
const props = defineProps<{
   title?: string;
   noHeader?: boolean;
}>();
</script>

<style scoped></style>
