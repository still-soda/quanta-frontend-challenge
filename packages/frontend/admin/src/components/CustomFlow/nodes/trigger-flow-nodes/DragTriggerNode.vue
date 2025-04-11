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
                  v-model="data.from"
                  label="从选择器"></TInput>
               <TInput type="text" v-model="data.to" label="到选择"></TInput>
            </TSpace>
         </div>
      </div>
   </BasicNode>
</template>

<script setup lang="ts">
import { NodeProps, useNode } from '@vue-flow/core';
import BasicNode from '../BasicNode.vue';
import { reactive, watchEffect } from 'vue';
import { DragTriggerFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import TRIGGER_FLOW_CONFIG from './config';

defineProps<NodeProps<DragTriggerFlowData>>();

const headerConfig = TRIGGER_FLOW_CONFIG['trigger:wait'];

const node = useNode<DragTriggerFlowData>().node;
const data = reactive<ExtractData<DragTriggerFlowData>>({
   from: '',
   to: '',
});

// 将数据转换为可编辑的格式
watchEffect(() => {
   if (!node.data) return;
   data.from = node.data.detail.from;
   data.to = node.data.detail.to;
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'trigger',
      detail: {
         type: 'drag',
         from: data.from,
         to: data.to,
      },
   };
});
</script>
