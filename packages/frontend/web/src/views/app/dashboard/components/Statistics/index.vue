<template>
   <BaseContainer title="排名统计" class="h-[24.4375rem]">
      <div class="flex flex-col items-center">
         <RingChart
            width="10.4375rem"
            height="10.4375rem"
            thickness="0.7rem"
            :percent="percent"
            class="w-full h-full text-orange-high my-[2.75rem]">
            <template #icon>
               <Celebrate class="size-[4.875rem]" />
            </template>
            <template v-slot:text="{ displayPercent }">
               <span class="text-[1.4rem] text-red-base -mt-2">
                  {{ (displayPercent * 100).toFixed(0) }}%
               </span>
            </template>
         </RingChart>
         <div class="flex items-center gap-1 h-[2.75rem] mb-[1.19rem]">
            <div class="text-[2rem] font-medium flex gap-0.5">
               {{ (percent * 100).toFixed(0) }}
               <span class="text-[1rem] font-medium mt-2">%</span>
            </div>
            <div class="text-xs text-gray-700 mt-1 w-[6.3125rem]">
               已经超越同站{{ (percent * 100).toFixed(0) }}%的人，继续加油！
            </div>
         </div>
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import { BaseContainer, RingChart } from '@/components';
import { Celebrate } from '@/components/Icons';
import { ref } from 'vue';

const percent = ref(0.45);
</script>
