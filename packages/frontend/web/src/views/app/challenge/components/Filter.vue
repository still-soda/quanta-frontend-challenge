<template>
   <div class="flex gap-2">
      <Select v-model:value="orderValue">
         <Option value="inc-time" label="按发布时间升序" />
         <Option value="dec-time" label="按发布时间降序" />
      </Select>
      <Select v-model:value="difficultyValue">
         <Option value="all" label="全部" />
         <Option value="easy" label="简单" />
         <Option value="mediumn" label="中等" />
         <Option value="hard" label="困难" />
      </Select>
      <Select v-model:value="tagValue">
         <Option value="all" label="全部" />
         <Option value="css" label="CSS" />
         <Option value="javascript" label="JavaScript" />
      </Select>
      <Popover position="ct" class="ml-2">
         <template #content>
            <div class="text-nowrap">随机挑战</div>
         </template>
         <Button
            type="primary"
            class="!rounded-full !size-[2.1875rem] flex items-center justify-center">
            <div class="size-5">
               <Random class="size-5" />
            </div>
         </Button>
      </Popover>
   </div>
   <div class="ml-auto">
      <SearchBar />
   </div>
</template>

<script setup lang="ts">
import SearchBar from './SearchBar.vue';
import { Select, Option, Button, Popover } from '@/components';
import { Random } from '@/components/Icons';
import { ref } from 'vue';

const orderValue = ref('inc-time');
const difficultyValue = ref('all');
const tagValue = ref('all');
</script>

<style scoped></style>
