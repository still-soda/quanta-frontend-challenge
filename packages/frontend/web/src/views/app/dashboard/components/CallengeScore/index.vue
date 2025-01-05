<template>
   <BaseContainer title="挑战得分">
      <div class="flex flex-col items-center h-full justify-between">
         <RingChart
            thickness="0.7rem"
            width="10.4375rem"
            class="w-full h-full text-orange-high my-auto">
            <template #icon>
               <Fire class="size-16" />
            </template>
            <template v-slot:text="{ displayPercent }">
               <span class="text-[1.5rem] text-red-base">
                  {{ (displayPercent * 3000).toFixed(0) }}
               </span>
            </template>
         </RingChart>
         <div class="text-xs px-1 text-center text-gray-500 w-[8.5rem]">
            排名将会根据得分在每周一凌晨1点刷新
         </div>
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import { BaseContainer, RingChart } from '@/components';
import { Fire } from '@/components/Icons';
</script>
