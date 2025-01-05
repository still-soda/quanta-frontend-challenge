<template>
   <Table :data="data" :order="tableOrder" class="mb-2 h-fit">
      <template #cols>
         <col style="width: 12%" />
         <col style="width: 28%" />
         <col style="width: 12%" />
         <col v-for="_ in 2" style="width: 24%" />
      </template>
      <template #header="{ key }">
         <div class="translate-x-1">{{ (header as any)[key] }}</div>
      </template>
      <template #status="{ value, idx }">
         <div class="flex gap-2 items-center">
            <Check class="text-green-base" v-if="value === 'done'" />
            <Close class="text-red-shallow" v-else />
            <Trophy
               v-if="data[idx].top !== 0"
               :class="{
                  'text-orange-high': data[idx].top === 1,
                  'text-gray-500': data[idx].top === 2,
                  'text-yellow-700': data[idx].top === 3,
               }" />
         </div>
      </template>
      <template #id="{ value }">
         <Button
            type="link"
            @click="viewDetail(value)"
            :disabled="value === currentView"
            class="!px-0">
            查看详情
         </Button>
      </template>
   </Table>
</template>

<script setup lang="ts">
import { Table, Button } from '@/components';
import { Check, Close, Trophy } from '@/components/Icons';
import { ref } from 'vue';

const tableOrder = ['status', 'dateTime', 'score', 'detail', 'id'];
const header = {
   status: '状态',
   dateTime: '时间',
   score: '得分',
   detail: '详情',
   id: '操作',
};
const data = [
   {
      id: 1,
      status: 'done',
      dateTime: '2021.09.01 12:00:00',
      score: 75,
      detail: '完美实现',
      top: 1,
   },
   {
      id: 2,
      status: 'error',
      dateTime: '2021.09.01 12:00:00',
      score: 75,
      detail: '完美实现',
      top: 2,
   },
   {
      id: 3,
      status: 'done',
      dateTime: '2021.09.01 12:00:00',
      score: 75,
      detail: '完美实现',
      top: 3,
   },
];

const currentView = ref(1);

function viewDetail(id: number) {
   console.log('查看详情: ', id);
}
</script>
