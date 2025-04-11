<template>
   <div class="w-full flex flex-col gap-1">
      <div class="text-md font-bold mb-4">通过率最低题目</div>
      <div class="h-64 mx-2 overflow-auto relative">
         <div
            class="flex justify-between items-center border-b pb-2 mb-1 sticky top-0 bg-white z-10">
            <div class="text-gray-500 flex-1 grow-[2]">题目</div>
            <div class="text-gray-500 flex-1 text-center">通过率</div>
            <div class="text-gray-500 flex-1 text-center">操作</div>
         </div>
         <div
            v-for="item in data"
            :key="item.id"
            class="flex justify-between items-center py-2">
            <div class="text-black flex-1 grow-[2] line-clamp-1 mr-1">
               {{ item.title }}
            </div>
            <div class="text-black flex-1 text-center">
               {{ (item.passRate * 100).toFixed(2) }}%
            </div>
            <div class="text-black flex-1 text-center">
               <RouterLink
                  :to="`/challenge/detail?id=${item.id}`"
                  class="text-orange-high">
                  查看详情
               </RouterLink>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const data = [
   {
      title: '一个简单到不能再简单的题目',
      passRate: 0.25,
      id: '1',
   },
   {
      title: '一个简单到不能再简单的题目',
      passRate: 0.15,
      id: '2',
   },
   {
      title: '一个简单到不能再简单的题目',
      passRate: 0.25,
      id: '3',
   },
   {
      title: '一个简单到不能再简单的题目',
      passRate: 0.15,
      id: '4',
   },
   {
      title: '一个简单到不能再简单的题目',
      passRate: 0.15,
      id: '5',
   },
   {
      title: '一个新的题目',
      passRate: 0.3,
      id: '6',
   },
   {
      title: '一个新的题目',
      passRate: 0.3,
      id: '7',
   },
   {
      title: '一个新的题目',
      passRate: 0.3,
      id: '8',
   },
   {
      title: '一个新的题目',
      passRate: 0.3,
      id: '9',
   },
];
</script>
