<template>
   <div class="flex gap-[0.2rem] p-[0.3rem]">
      <main
         v-for="(month, idx) in displayMonths"
         :key="month"
         class="flex flex-col gap-1.5">
         <div class="text-xs">{{ MONTH_TEXT[month] }}</div>
         <div class="cell-grid">
            <Popover
               position="ct"
               :y-offset="5"
               v-for="day in displayDaysRange[idx]"
               :key="`${month}-${day}`">
               <Cell :level="getLevel(month, day)" />
               <template #content>
                  <div class="flex flex-col text-nowrap text-xs gap-1">
                     <h3>
                        {{
                           (() => {
                              const submit = getSubmit(month, day);
                              const date = `${month + 1}月${day + 1}日`;
                              return submit === 0
                                 ? `${date}没有提交`
                                 : `${date}提交了 ${submit} 次`;
                           })()
                        }}
                     </h3>
                  </div>
               </template>
            </Popover>
         </div>
      </main>
   </div>
</template>

<script setup lang="ts">
import { MONTH_TEXT, MONTH_DAY } from '@/constant/date.constant';
import { range } from '@challenge/utils';
import Cell from './components/Cell.vue';
import Popover from '@/components/Popover/index.vue';
import type { AcitveMockType } from './index.types';

const props = defineProps<{
   activeData: AcitveMockType;
}>();

// 展示的月份个数
const displayCount = 5;
// 当前月份以及先前的月份
const currentMonth = new Date().getMonth();
const displayMonths = (() => {
   const startMonth =
      (currentMonth > displayCount
         ? currentMonth
         : currentMonth + 12 - displayCount) -
      displayCount +
      1;
   const month = range(startMonth, startMonth + displayCount);
   return month;
})();
// 展示月份的天数
const displayDays = displayMonths.map((m: number) => MONTH_DAY[m]);
const displayDaysRange = displayDays.map((d: number) => range(d));

const currentYear = new Date().getFullYear();

// 获取某一天的活跃度
function getLevel(m: number, d: number) {
   const y = m > currentMonth ? currentYear - 1 : currentYear;
   const active = props.activeData[y]?.[m]?.[d]?.level ?? 'none';
   return active;
}

// 获取某一天的提交次数
function getSubmit(m: number, d: number) {
   const y = m > currentMonth ? currentYear - 1 : currentYear;
   const submit = props.activeData[y]?.[m]?.[d]?.submit ?? 0;
   return submit;
}
</script>

<style scoped>
.cell-grid {
   display: grid;
   grid-template-rows: repeat(11, 1fr);
   grid-template-columns: repeat(3, 1fr);
   grid-auto-flow: column;
   gap: 0.25rem;
}
</style>
