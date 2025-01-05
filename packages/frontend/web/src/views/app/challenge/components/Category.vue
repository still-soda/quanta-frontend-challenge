<template>
   <div class="flex gap-[0.94rem] items-center">
      <CategoryTag class="bg-dark-normal text-white">全部</CategoryTag>
      <CategoryTag class="bg-white text-dark-normal">
         <div class="flex items-center gap-2 font-medium">
            <CSS />
            CSS
         </div>
      </CategoryTag>
      <CategoryTag class="bg-white text-dark-normal font-medium">
         <div class="flex items-center gap-2">
            <JavaScript />
            JavaScript
         </div>
      </CategoryTag>
   </div>
</template>

<script setup lang="ts">
import CategoryTag from './CategoryTag.vue';
import { CSS, JavaScript } from '@/components/Icons';
</script>

<style scoped></style>
