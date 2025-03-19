<template>
   <BaseContainer title="站内排名" class="h-full relative col-span-2">
      <template #extra>
         <Button type="link" class="text-xs text-gray-500">
            <RouterLink to="/rank" class="flex items-center gap-0.5">
               查看更多<Go class="translate-y-[1px]" />
            </RouterLink>
         </Button>
      </template>
      <template #default>
         <div
            class="flex px-3 text-base gap-6 text-dark-normal items-center mb-1">
            <div class="text-center text-nowrap">
               <div>当前排名</div>
               <div class="text-5xl font-semibold tracking-wide">
                  {{ currentRank }}
               </div>
            </div>
            <div class="text-center text-red-base">
               <div>排名变化</div>
               <div class="text-5xl font-semibold tracking-wide">
                  {{ rankChange }}
               </div>
            </div>
            <div class="gap-1 flex items-center ml-auto mr-2 flex-wrap">
               <span
                  class="size-[0.875rem] rounded-[0.1875rem] bg-orange-high shrink-0"></span>
               <span
                  class="text-xs text-gray-500 overflow-ellipsis text-nowrap">
                  排名趋势
               </span>
            </div>
         </div>
         <TrendChart
            class="pr-2"
            style="width: 100%; height: 100%"
            :data="data"
            :start-month="startMonth"
            :end-month="endMonth" />
      </template>
   </BaseContainer>
</template>

<script setup lang="ts">
import { getMyHistoryRank } from '@challenge/api';
import { BaseContainer, TrendChart, Button } from '@/components';
import { Go } from '@/components/Icons';
import { ref } from 'vue';

const data = ref<number[]>(new Array(6).fill(99));
const currentRank = ref('--');
const rankChange = ref('--');

// 设置月份范围
const endMonth = new Date().getMonth() + 1;
const start = endMonth - 6;
const startMonth = start < 0 ? 12 + start : start;

init();
async function init() {
   // 获取我的历史排名
   const {
      data: { history, earliestRankCount },
   } = await getMyHistoryRank();

   // 提取最近 6 个月的排名
   let rank = history.map((item) => item.rank);
   rank =
      rank.length < 6
         ? new Array(6 - rank.length).fill(earliestRankCount).concat(rank)
         : rank.slice(0, 6);
   data.value = rank;

   // 设置当前排名和排名变化
   const recent = rank[rank.length - 1];
   const last = rank[rank.length - 2];

   currentRank.value = recent < 10 ? `0${recent}` : recent.toString();

   const change = recent - last;
   if (change > 0) {
      rankChange.value = `-${change}`;
   } else if (change < 0) {
      rankChange.value = `+${-change}`;
   } else {
      rankChange.value = '0';
   }
}
</script>
