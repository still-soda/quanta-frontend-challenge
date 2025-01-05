<template>
   <BaseContainer title="提交详情" class="w-[16.5rem]">
      <div class="flex flex-col gap-2 my-4">
         <div class="w-full flex justify-center my-[0.9rem]">
            <SuccessBadge class="text-green-base" />
         </div>
         <div class="w-full flex flex-col items-center gap-2 font-medium">
            <div>
               正确率：<span class="text-orange-high font-semibold">
                  {{ 75 }}%
               </span>
            </div>
            <ProgressBar :percent="0.75" />
            <div
               class="flex flex-col justify-center items-center text-xs mt-2.5">
               <div class="flex gap-1 items-center">
                  <Average />
                  <span> 平均正确率：{{ 50 }}% </span>
               </div>
               <div class="flex gap-1 items-center">
                  <Thumb />
                  <span> 最高正确率：{{ 90 }}% </span>
               </div>
            </div>
         </div>
         <div
            class="mt-auto flex justify-center items-center text-xs text-gray-500 mb-2 pt-3.5">
            你实现的效果非常完美！
         </div>
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import { BaseContainer, ProgressBar } from '@/components';
import { SuccessBadge } from '@/components/Icons';
</script>
