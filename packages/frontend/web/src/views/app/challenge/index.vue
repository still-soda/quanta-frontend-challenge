<template>
   <BaseContainer class="m-4" no-header>
      <div class="flex gap-2 p-[0.62rem] items-center">
         <div class="text-xl">筛选：</div>
         <Filter />
      </div>
      <div class="flex gap-2 p-[0.62rem] items-center">
         <div class="text-xl">分类：</div>
         <Category />
      </div>
      <div class="mx-[1.88rem] text-dark-normal">
         <Table :data="data" :order="tableOrder">
            <template #cols>
               <col style="width: 8.5rem" />
               <col style="width: max-content" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
            </template>
            <template #header="{ key }">
               <div class="flex justify-between items-center">
                  <span>
                     {{ tableHead[key] }}
                  </span>
                  <div
                     v-if="sortables.includes(key as any)"
                     @click="sort(key)"
                     class="-translate-x-2 hover:cursor-pointer hover:scale-105 transition-transform active:scale-95">
                     <Sort />
                  </div>
               </div>
            </template>
            <template #status="{ value, idx }">
               <div class="flex gap-2 items-center shrink-0 w-8">
                  <div v-if="value === 'done'" class="size-6">
                     <Check class="text-green-base size-6" />
                  </div>
                  <div v-else-if="value === 'error'" class="size-6">
                     <Close class="text-red-shallow size-6" />
                  </div>
                  <div
                     v-if="data[idx].top !== 0 && value === 'done'"
                     class="size-6">
                     <Trophy
                        class="translate-y-[0.1rem]"
                        :class="{
                           'text-orange-high': data[idx].top === 1,
                           'text-gray-500': data[idx].top === 2,
                           'text-yellow-700': data[idx].top === 3,
                        }" />
                  </div>
               </div>
            </template>
            <template #name="{ value, idx }">
               <Button
                  type="link"
                  class="w-full max-w-72 text-nowrap py-1 font-medium px-0 overflow-hidden whitespace-nowrap overflow-ellipsis">
                  <RouterLink :to="`/challenge/detail?id=${data[idx].id}`">
                     {{ data[idx].id + 1 }}.
                     {{ value }}
                  </RouterLink>
               </Button>
            </template>
            <template #correctRate="{ value }">
               {{ (value * 100).toFixed(2) }}%
            </template>
            <template #difficulty="{ value }">
               <div
                  :class="{
                     'text-green-base': value === '简单',
                     'text-orange-high': value === '中等',
                     'text-red-shallow': value === '困难',
                  }">
                  {{ value }}
               </div>
            </template>
            <template #tags="{ value }">
               <div class="flex gap-2">
                  <Tag
                     v-for="tag in value"
                     :key="tag"
                     type="info"
                     class="bg-[#3281FF] py-[0.25rem]">
                     {{ tag }}
                  </Tag>
               </div>
            </template>
         </Table>
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import { BaseContainer, Table, Tag, Button } from '@/components';
import { Check, Close, Trophy, Sort } from '@/components/Icons';
import Filter from './components/Filter.vue';
import Category from './components/Category.vue';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { CompareChain } from '@challenge/utils';

const tableOrder = [
   'status',
   'name',
   'submitCount',
   'correctRate',
   'difficulty',
   'score',
   'tags',
];

const tableHead = {
   status: '状态',
   name: '题目',
   submitCount: '提交次数',
   correctRate: '正确率',
   difficulty: '难度',
   score: '得分',
   tags: '标签',
} as { [key: string]: string };

const sortables = [
   'submitCount',
   'correctRate',
   'score',
   'difficulty',
] as const;

const sortedStatus = {
   submitCount: 0,
   correctRate: 0,
   score: 0,
   difficulty: 0,
};

// 多级排序，详情见 compare-chain.utils.ts
const chain = new CompareChain<any>();
function sort(key?: string) {
   const k = key as keyof typeof sortedStatus;
   if (sortedStatus[k] === 0 || sortedStatus[k] === -1) {
      sortedStatus[k] = 1;
   } else if (sortedStatus[k] === 1) {
      sortedStatus[k] = -1;
   }
   chain.reset();

   const statusOrder = ['done', 'error', ''];
   chain.toCompare((a, b) => {
      return (
         statusOrder.indexOf(a['status']) - statusOrder.indexOf(b['status'])
      );
   });

   Object.entries(sortedStatus).forEach(([name, sortedBy]) => {
      if (sortedBy === 0) {
         return;
      } else if (sortedBy === 1) {
         if (name === 'difficulty') {
            chain.toCompare((a, b) => {
               const order = ['简单', '中等', '困难'];
               return order.indexOf(a[name]) - order.indexOf(b[name]);
            });
         } else {
            chain.toCompare((a, b) => a[name] - b[name]);
         }
      } else if (sortedBy === -1) {
         if (name === 'difficulty') {
            chain.toCompare((a, b) => {
               const order = ['简单', '中等', '困难'];
               return order.indexOf(b[name]) - order.indexOf(a[name]);
            });
         } else {
            chain.toCompare((a, b) => b[name] - a[name]);
         }
      }
   });
   data.value = chain.toSort(data.value);
}

const data = ref(
   (() => {
      const data = [];
      for (let i = 0; i < 40; i++) {
         data.push({
            name: 'Easy CSS Button',
            id: i,
            correctRate: 0.6667,
            difficulty: ['简单', '中等', '困难'][Math.floor(Math.random() * 3)],
            tags: ['CSS', 'CSS'],
            status: ['done', '', '', '', 'error'][
               Math.floor(Math.random() * 5)
            ],
            top: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
            score: 40,
            submitCount: Math.floor(Math.random() * 1200),
         });
      }
      return data;
   })()
);
sort();
</script>
