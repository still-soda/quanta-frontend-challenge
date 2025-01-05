<template>
   <div
      class="py-[0.3rem] px-[0.5rem] rounded-[0.375rem] bg-white shadow-inside flex gap-2 items-center has-[input:focus]:scale-110 transition-transform">
      <Search />
      <input
         v-bind="$attrs"
         type="text"
         placeholder="搜索题目或编号"
         class="w-[8rem] outline-none" />
   </div>
</template>

<script setup lang="ts">
import { Search } from '@/components/Icons';
</script>
