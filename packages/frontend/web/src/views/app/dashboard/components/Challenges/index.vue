<template>
   <BaseContainer
      title="最新挑战"
      class="col-span-3 relative h-[24.4375rem] max-h-fit overflow-x-hidden">
      <template #extra>
         <Button type="link" class="text-xs text-gray-500 -mr-2">
            <RouterLink to="/challenge" class="flex items-center gap-0.5">
               查看更多<Go class="translate-y-[1px]" />
            </RouterLink>
         </Button>
      </template>
      <div
         class="flex relative flex-col gap-8 mt-4 mr-1 pb-5 px-3 h-full overflow-auto max-h-fit hide-scrollbar">
         <Notification
            date="2024.11.29"
            is-new
            :tags="{ warning: '中等' }"
            publisher="still-soda"
            language="JavaScript">
            <div class="gap-2 flex flex-col">
               <header class="flex gap-2 text-base px-1 mb-1">
                  <div class="flex gap-2 items-center">
                     <i class="fas fa-file-code text-orange-high"></i>
                     <h1 class="text-dark-normal text-sm font-semibold">
                        填充代码
                     </h1>
                  </div>
                  <div class="font-medium tracking-wider text-xs ml-auto">
                     25 &nbsp;points
                  </div>
               </header>
               <p>尝试补充代码，使得点击按钮后列表自动增加 3 条。要求如下：</p>
               <ul class="list-disc list-inside ml-3">
                  <li>点击按钮后列表自动增加 3 条</li>
                  <li>点击按钮后列表自动增加 3 条</li>
                  <li>点击按钮后列表自动增加 3 条</li>
               </ul>
            </div>
         </Notification>
         <Notification
            date="2024.11.29"
            publisher="still-soda"
            :tags="{ success: '简单' }"
            language="JavaScript">
            <div class="gap-2 flex flex-col">
               <header class="flex gap-2 text-base px-1 mb-1">
                  <div class="flex gap-2 items-center">
                     <i class="fas fa-file-code text-orange-high"></i>
                     <h1 class="text-dark-normal text-sm font-semibold">
                        填充代码
                     </h1>
                  </div>
                  <div class="font-medium tracking-wider text-xs ml-auto">
                     25 &nbsp;points
                  </div>
               </header>
               <p>尝试补充代码，使得点击按钮后列表自动增加 3 条。要求如下：</p>
               <ul class="list-disc list-inside ml-3">
                  <li>点击按钮后列表自动增加 3 条</li>
                  <li>点击按钮后列表自动增加 3 条</li>
                  <li>点击按钮后列表自动增加 3 条</li>
               </ul>
            </div>
         </Notification>
         <Notification
            date="2024.11.29"
            publisher="still-soda"
            language="JavaScript">
            <div class="gap-2 flex flex-col">
               <header class="flex gap-2 text-base px-1 mb-1">
                  <div class="flex gap-2 items-center">
                     <i class="fas fa-file-code text-orange-high"></i>
                     <h1 class="text-dark-normal text-sm font-semibold">
                        填充代码
                     </h1>
                  </div>
                  <div class="font-medium tracking-wider text-xs ml-auto">
                     25 &nbsp;points
                  </div>
               </header>
               <p>尝试补充代码，使得点击按钮后列表自动增加 3 条。要求如下：</p>
               <ul class="list-disc list-inside ml-3">
                  <li>点击按钮后列表自动增加 3 条</li>
                  <li>点击按钮后列表自动增加 3 条</li>
                  <li>点击按钮后列表自动增加 3 条</li>
               </ul>
            </div>
         </Notification>
      </div>
      <div
         class="absolute bottom-2 w-full text-center bg-gradient-to-t from-white via-white to-transparent h-8"></div>
   </BaseContainer>
</template>

<script setup lang="ts">
import Notification from './components/Notification.vue';
import { Button, BaseContainer } from '@/components';
import { Go } from '@/components/Icons';
</script>

<style scoped></style>
