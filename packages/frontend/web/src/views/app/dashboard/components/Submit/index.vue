<template>
   <BaseContainer
      title="最近提交"
      class="text-dark-normal h-[24.4375rem] gap-[0.81rem]">
      <template #extra>
         <Button type="link" class="text-xs text-gray-500 -mr-4">
            <RouterLink to="/profile" class="flex items-center gap-0.5">
               查看更多<Go class="translate-y-[1px]" />
            </RouterLink>
         </Button>
      </template>
      <div class="flex gap-2 text-nowrap items-center justify-center mt-2 px-2">
         <UnknowFile />
         <span class="text-sm text-ellipsis overflow-hidden w-full">
            # Easy CSS Button
         </span>
      </div>
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
         <div class="flex flex-col justify-center items-center text-xs mt-2.5">
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
   </BaseContainer>
</template>

<script setup lang="ts">
import { BaseContainer, Button, ProgressBar } from '@/components';
import {
   SuccessBadge,
   Average,
   Thumb,
   UnknowFile,
   Go,
} from '@/components/Icons';
</script>
