<template>
   <BasicNode terminal="both">
      <template #head>
         <div class="flex gap-1 items-center font-semibold">
            <TIcon :name="headerConfig.icon" />
            {{ headerConfig.title }}
         </div>
      </template>

      <div class="flex flex-col my-2 gap-2">
         <div class="w-52">
            <TSpace direction="vertical" size="small" class="w-full">
               <TInput type="number" v-model="data.x" label="X"></TInput>
               <TInput type="number" v-model="data.y" label="Y"></TInput>
            </TSpace>
         </div>
      </div>
   </BasicNode>
</template>

<script setup lang="ts">
import { NodeProps, useNode } from '@vue-flow/core';
import BasicNode from '../BasicNode.vue';
import { reactive, watchEffect } from 'vue';
import { ScrollMouseFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import MOUSE_FLOW_CONFIG from './config';

defineProps<NodeProps<ScrollMouseFlowData>>();

const headerConfig = MOUSE_FLOW_CONFIG['mouse:scroll'];

const node = useNode<ScrollMouseFlowData>().node;
const data = reactive<ExtractData<ScrollMouseFlowData>>({});

// 将数据转换为可编辑的格式
watchEffect(() => {
   if (!node.data) return;
   data.x = node.data.detail.x;
   data.y = node.data.detail.y;
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'mouse',
      detail: {
         type: 'scroll',
         x: data.x,
         y: data.y,
      },
   };
});
</script>
