<template>
   <div class="p-4 flex relative gap-[1.25rem]">
      <BaseContainer title="挑战排名" class="w-full">
         <template #title="{ title }">
            <div
               class="text-[1.5rem] font-bold bg-gradient-to-r bg-clip-text from-dark-from to-dark-to text-transparent">
               {{ title }}
            </div>
         </template>
         <template #extra>
            <div
               class="text-xs text-gray-400 h-full flex items-center tracking-tight">
               距离下次排行榜更新还有 {{ updateDate.day }} 天
               {{ updateDate.hour }} 小时 {{ updateDate.second }} 秒
            </div>
         </template>
         <div class="w-full text-gray-500 flex justify-between">
            <div>你当前的挑战排名为 {{ myRank }}</div>
            <div>
               <Button
                  @click="locateRank(myRank)"
                  type="secondary"
                  class="text-gray-500 border-gray-500 text-sm">
                  定位到当前排名
               </Button>
            </div>
         </div>
         <div ref="table">
            <Table
               :data="data"
               :order="['rank', 'avatar', 'name', 'score']"
               class="text-base mt-2 text-dark-normal">
               <template #head-rank>
                  <div class="w-full text-center order-2">排名</div>
               </template>
               <template #head-name>
                  <div class="w-full text-center order-1">名字</div>
               </template>
               <template #head-score>
                  <div class="w-full text-center">得分</div>
               </template>
               <template #head-avatar>
                  <div class="w-full text-center">头像</div>
               </template>

               <template #rank="{ value, idx }">
                  <div
                     class="text-center relative w-full"
                     :class="{
                        'text-orange-high font-bold': idx === myRank - 1,
                     }"
                     :id="`rank-${value}`">
                     <div
                        v-if="value <= 3"
                        class="absolute left-4"
                        :class="{
                           'text-orange-high': value === 1,
                           'text-gray-500': value === 2,
                           'text-yellow-700': value === 3,
                        }">
                        <Trophy />
                     </div>
                     {{ value }}
                  </div>
               </template>
               <template #name="{ value, idx }">
                  <div
                     class="text-center"
                     :class="{
                        'text-orange-high font-bold': idx === myRank - 1,
                     }">
                     {{ value }}
                  </div>
               </template>
               <template #score="{ value, idx }">
                  <div
                     class="text-center"
                     :class="{
                        'text-orange-high font-bold': idx === myRank - 1,
                     }">
                     {{ value }}
                  </div>
               </template>
               <template #avatar="{ value, idx }">
                  <div class="flex w-full justify-center">
                     <img
                        :src="value"
                        class="w-[2.125rem] rounded-full"
                        :class="{
                           'ring-2 ring-orange-high ring-offset-2':
                              idx === myRank - 1,
                        }" />
                  </div>
               </template>
            </Table>
         </div>
      </BaseContainer>
      <aside class="flex flex-col gap-[1.25rem] w-fit">
         <BaseContainer title="分数定位" class="w-[19.0625rem]">
            <BarChart
               :scores="scoresMock"
               :users="myData"
               :image-size="18"
               height="11.5rem"
               width="16rem"
               class="my-5" />
            <div
               class="flex items-center justify-center text-dark-normal mb-1 -mt-1">
               <div class="flex items-start gap-1">
                  <span class="text-2xl font-semibold tracking-tighter">
                     1200
                  </span>
                  <span class="mt-1 text-sm text-gray-500">分</span>
               </div>
               <div class="w-[2px] h-6 my-1 mx-2 bg-gray-300 rounded-xl"></div>
               <div class="flex items-start gap-1">
                  <span class="mt-1 text-sm text-gray-500">击败</span>
                  <span class="text-2xl font-semibold tracking-tighter">
                     90%
                  </span>
               </div>
            </div>
         </BaseContainer>
         <BaseContainer no-header class="w-[19.0625rem]">
            <div class="flex flex-col gap-[0.62rem]">
               <div class="flex gap-3">
                  <Trophy class="text-orange-high" />
                  <span>荣获 1 次一血</span>
               </div>
               <div class="flex gap-3">
                  <Trophy class="text-gray-500" />
                  <span>荣获 3 次二血</span>
               </div>
            </div>
         </BaseContainer>

         <ReturnTop
            class="bottom-6 transition-opacity duration-300"
            :class="{
               'opacity-0 pointer-events-none': !showReturnTop,
               'opacity-100 pointer-events-auto': showReturnTop,
            }" />
      </aside>
   </div>
</template>

<script setup lang="ts">
import {
   BaseContainer,
   BarChart,
   Button,
   Table,
   ReturnTop,
} from '@/components';
import scoresMock from '@/mock/score.mock';
import { Trophy } from '@/components/Icons';
import { inject, onMounted, onUnmounted, Ref, ref } from 'vue';
import { shiftDate, dateToObject } from '@challenge/utils';

const data = (() => {
   const data = [];
   for (let i = 0; i < 40; i++) {
      const score = Math.floor(Math.random() * 1500);
      data.push({
         name: '张三',
         score,
         avatar:
            'https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg',
      });
   }
   return data
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
         rank: index + 1,
         ...item,
      }));
})();

const myRank = ref(20);
const myData = [
   {
      score: 60,
      avatar: data[myRank.value - 1].avatar,
   },
];

const delayedDate = shiftDate(new Date(), { days: 3, hours: 5 });
const updateDate = ref(
   dateToObject(new Date(delayedDate.getTime() - Date.now()))
);

const showReturnTop = ref(false);
const table = ref<HTMLElement | null>(null);
const navigatorHeight = inject('navigatorHeight') as Ref<number>;

function checkHeaderVisibility() {
   if (!table.value) {
      return;
   }
   const tableTop = table.value.getBoundingClientRect().top;
   showReturnTop.value = navigatorHeight.value > tableTop;
}

onMounted(() => {
   window.addEventListener('scroll', checkHeaderVisibility);
});

onUnmounted(() => {
   window.removeEventListener('scroll', checkHeaderVisibility);
});

function locateRank(rank: number) {
   const element = document.getElementById(`rank-${rank - 1}`);
   if (element) {
      element.scrollIntoView({
         behavior: 'smooth',
      });
   }
}
</script>
