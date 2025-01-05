<template>
   <div class="p-4 flex gap-4">
      <aside class="flex flex-col gap-4">
         <BaseContainer title="个人资料" class="w-[13.9375rem]">
            <div class="w-[9.875rem] relative mt-2 mx-auto">
               <img
                  :src="avatar"
                  alt="头像"
                  class="size-[9.875rem] rounded-full shrink-0" />
               <div
                  class="size-[2.1875rem] rounded-full absolute right-1 bottom-1 bg-[#FFD5BB] border-4 border-white flex items-center justify-center hover:scale-105 hover:cursor-pointer transition-transform">
                  <Pen class="text-orange-high" />
               </div>
            </div>
            <div class="mt-3">
               <div class="font-bold text-lg">still-soda</div>
               <div class="font-thin text-sm">20231003059</div>
               <Button
                  class="w-full text-center rounded-[0.375rem] py-0.5 mt-4">
                  编辑资料
               </Button>
            </div>
            <div class="flex flex-col gap-1 mt-3 mb-2">
               <div class="flex items-center gap-1">
                  <Call />
                  <span class="font-light text-sm">13400000001</span>
               </div>
               <div class="flex items-center gap-1">
                  <Chat />
                  <span class="font-light text-sm">这是一个很酷的人</span>
               </div>
            </div>
         </BaseContainer>
         <BaseContainer no-header class="w-[13.9375rem] py-3">
            <div class="w-[9.875rem] flex flex-col gap-2">
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
      </aside>
      <BaseContainer
         title="活动记录"
         class="w-full overflow-hidden relative overscroll-x-none min-h-[42rem]"
         :style="{
            height: showAll
               ? 'fit-content'
               : `calc(100vh - ${navigatorHeight}px - 2rem)`,
         }">
         <div class="w-full">
            <TimeLine
               v-for="_ in 10"
               title="你完成了挑战 “Easy CSS Button”"
               date="2024.01.01"
               status="通过"
               :status-color="(score: number) => (score > 60 ? 'green' : 'red')"
               :score="90" />
            <div class="w-full text-center mt-4 text-gray-500">
               没有更多了哦 ~
            </div>
         </div>
         <div
            v-if="!showAll"
            class="sticky w-full py-4 -bottom-[1.19rem] flex items-center justify-center bg-gradient-to-t from-white via-white/80 to-transparent text-dark-normal text-sm">
            <Button type="link" @click="showAll = true">查看更多</Button>
         </div>
      </BaseContainer>
      <BaseContainer title="挑战热力图" class="w-[21rem] h-fit">
         <div class="w-[21rem">
            <HeatMap :active-data="activeMock" class="my-2" />
         </div>
         <div
            class="font-bold bg-gradient-to-r from-dark-from to-dark-to bg-clip-text text-transparent w-fit mt-4">
            挑战得分
         </div>
         <div class="flex justify-evenly mt-2">
            <RingChart
               width="6.5625rem"
               height="6.5625rem"
               no-text
               thickness="0.5rem">
               <template #icon>
                  <Fire class="size-10 text-orange-high -translate-y-1" />
               </template>
            </RingChart>
            <RingChart
               width="6.5625rem"
               height="6.5625rem"
               no-text
               thickness="0.5rem">
               <template #icon>
                  <Trophy class="size-10 text-orange-high" />
               </template>
            </RingChart>
         </div>
         <div
            class="w-full text-center font-semibold text-xl mt-2 mb-2 text-red-base">
            <div>2045 POINTS</div>
            <div>NO. 56</div>
         </div>
      </BaseContainer>
   </div>
</template>

<script setup lang="ts">
import {
   BaseContainer,
   Button,
   RingChart,
   TimeLine,
   HeatMap,
} from '@/components';
import { Pen, Call, Chat, Trophy, Fire } from '@/components/Icons';
import { inject, ref } from 'vue';
import activeMock from '@/mock/active.mock';

const avatar =
   'https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg';

const navigatorHeight = inject('navigatorHeight');
const showAll = ref(false);
</script>

<style scoped></style>
