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
               <div class="text-5xl font-semibold tracking-wide">96</div>
            </div>
            <div class="text-center text-red-base">
               <div>排名变化</div>
               <div class="text-5xl font-semibold tracking-wide">+03</div>
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
            :data="[60, 50, 55, 48, 40, 48]"
            :start-month="0"
            :end-month="6" />
      </template>
   </BaseContainer>
</template>

<script setup lang="ts">
import { BaseContainer, TrendChart, Button } from '@/components';
import { Go } from '@/components/Icons';
</script>
