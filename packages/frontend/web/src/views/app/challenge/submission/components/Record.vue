<template>
   <div class="flex">
      <aside class="w-[3.125rem] flex flex-col items-center -ml-2">
         <div
            class="line"
            :class="{
               'bg-green-base': prevStatus === 'success',
               'bg-red-shallow': prevStatus === 'fail',
            }"></div>
         <div
            class="size-6 shrink-0 border-2 rounded-full bg-white flex items-center justify-center"
            :class="{
               'border-green-base border-solid text-green-base': data.success,
               'border-red-shallow border-dashed text-red-shallow':
                  !data.success,
            }">
            <CheckSmall v-if="data.success" />
            <CloseSmall v-else />
         </div>
         <div
            class="line"
            :class="{
               'bg-green-base': nextStatus === 'success',
               'bg-red-base': nextStatus === 'fail',
            }"></div>
      </aside>
      <main
         class="px-[1.5rem] py-6 bg-[#F1F0F0] my-3 w-full rounded-lg flex flex-col gap-3">
         <div class="flex gap-[0.625rem] items-center">
            <div
               class="text-white text-xs px-2 rounded-inside"
               style="line-height: 166%"
               :class="{
                  'bg-red-base': data.type === 'action',
                  'bg-blue-base': data.type === 'testpoint',
               }">
               {{ data.type === 'action' ? 'Action' : 'Testpoint' }}
            </div>
            <div class="text-sm text-dark-normal">{{ data.text }}</div>
            <div
               v-if="data.type === 'testpoint'"
               class="text-green-base text-xs ml-auto">
               {{ data.score }} points
            </div>
         </div>
         <img
            class="rounded-sm max-w-[60%]"
            v-if="data.screenshot"
            :src="data.screenshot" />
      </main>
   </div>
</template>

<script setup lang="ts">
import { CheckSmall } from '@/components/Icons';
import { RecordData } from './record.type';
import CloseSmall from '@/components/Icons/CloseSmall.vue';

defineProps<{
   data: RecordData;
   prevStatus: 'none' | 'success' | 'fail';
   nextStatus: 'none' | 'success' | 'fail';
}>();
</script>

<style scoped>
.line {
   width: 2px;
   height: 100%;
}
</style>
