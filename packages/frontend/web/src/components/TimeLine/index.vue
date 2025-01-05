<template>
   <div class="w-full h-fit flex text-dark-normal">
      <div class="relative w-fit flex justify-center tracking-wide">
         <div
            class="absolute w-[50%] left-0 h-full border-r-[2px] border-gray-400"></div>
         <div
            class="mt-4 mx-1.5 -translate-x-[1.5px] flex size-[1.8125rem] text-xs items-center justify-center w-fit text-white rounded-full bg-orange-high aspect-square border-2 border-white z-10"
            :style="{ backgroundColor: iconColor }">
            <slot name="icon">
               <i class="fa fa-fire"></i>
            </slot>
         </div>
      </div>
      <div class="mt-4 flex flex-col gap-[11px] w-full">
         <slot name="header" :title="title" :date="date">
            <div class="flex justify-between items-center h-[1.7rem]">
               <slot name="title" :title="title">
                  <span class="font-bold text-sm">{{ title }}</span>
               </slot>
               <slot name="date" :date="date">
                  <span class="text-xs">{{ date }}</span>
               </slot>
            </div>
         </slot>
         <slot>
            <div class="flex flex-col gap-[0.44rem] text-sm mb-1">
               <div>得分 ：{{ score }} / 100</div>
               <div>
                  状态：
                  <span
                     class="text-green-500 font-bold"
                     :style="{
                        color:
                           statusColor &&
                           (typeof statusColor === 'string'
                              ? statusColor
                              : statusColor(score ?? 0)),
                     }">
                     {{
                        statusColor &&
                        (typeof status === 'string'
                           ? status
                           : status?.(score ?? 0))
                     }}
                  </span>
               </div>
            </div>
         </slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { Fire } from '@/components/Icons';

defineProps<{
   title: string;
   date: string;
   score?: number;
   status?: string | ((score: number) => string);
   statusColor?: string | ((score: number) => string);
   iconColor?: string;
}>();
</script>
