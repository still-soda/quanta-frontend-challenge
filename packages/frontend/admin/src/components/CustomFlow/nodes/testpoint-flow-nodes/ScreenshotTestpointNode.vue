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
               <TInput
                  type="text"
                  v-model="data.name"
                  label="测试点名称"></TInput>
               <TInputNumber
                  type="number"
                  v-model="data.score"
                  :min="0"
                  :step="1"
                  class="w-52"
                  label="分数"></TInputNumber>
               <TInput
                  type="text"
                  v-model="data.root"
                  label="截图根节点"></TInput>
               <TInputNumber
                  type="number"
                  v-model="data.threshold"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  class="w-52"
                  label="最低差异"></TInputNumber>
            </TSpace>
         </div>
      </div>
   </BasicNode>
</template>

<script setup lang="ts">
import { NodeProps, useNode } from '@vue-flow/core';
import BasicNode from '../BasicNode.vue';
import { reactive, watchEffect } from 'vue';
import { ScreenShotTestpointFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import TESTPOINT_FLOW_CONFIG from './config';

defineProps<NodeProps<ScreenShotTestpointFlowData>>();

const headerConfig = TESTPOINT_FLOW_CONFIG['testpoint:screenshot'];

const node = useNode<ScreenShotTestpointFlowData>().node;
const data = reactive<ExtractData<ScreenShotTestpointFlowData>>({
   name: '',
   root: '',
   score: 0,
   threshold: 0.9,
});

// 将数据转换为可编辑的格式
watchEffect(() => {
   if (!node.data) return;
   data.name = node.data.detail.name;
   data.root = node.data.detail.root;
   data.score = node.data.detail.score;
   data.threshold = node.data.detail.threshold;
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'testpoint',
      detail: {
         type: 'screenshot',
         name: data.name,
         root: data.root,
         score: data.score,
         threshold: data.threshold,
      },
   };
});
</script>
