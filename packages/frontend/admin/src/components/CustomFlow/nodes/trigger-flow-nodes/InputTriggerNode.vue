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
                  v-model="data.selector"
                  label="选择器"></TInput>
               <TInput type="text" v-model="data.value" label="值"></TInput>
            </TSpace>
         </div>
      </div>
   </BasicNode>
</template>

<script setup lang="ts">
import { NodeProps, useNode } from '@vue-flow/core';
import BasicNode from '../BasicNode.vue';
import { reactive, watchEffect } from 'vue';
import { InputTriggerFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import TRIGGER_FLOW_CONFIG from './config';

defineProps<NodeProps<InputTriggerFlowData>>();

const headerConfig = TRIGGER_FLOW_CONFIG['trigger:wait'];

const node = useNode<InputTriggerFlowData>().node;
const data = reactive<ExtractData<InputTriggerFlowData>>({
   selector: '',
   value: '',
});

// 将数据转换为可编辑的格式
watchEffect(() => {
   if (!node.data) return;
   data.selector = node.data.detail.selector;
   data.value = node.data.detail.value;
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'trigger',
      detail: {
         type: 'input',
         selector: data.selector,
         value: data.value,
      },
   };
});
</script>
