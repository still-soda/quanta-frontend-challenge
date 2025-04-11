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
            </TSpace>
         </div>
      </div>
   </BasicNode>
</template>

<script setup lang="ts">
import { NodeProps, useNode } from '@vue-flow/core';
import BasicNode from '../BasicNode.vue';
import { reactive, watchEffect } from 'vue';
import { BlurTriggerFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import TRIGGER_FLOW_CONFIG from './config';

defineProps<NodeProps<BlurTriggerFlowData>>();

const headerConfig = TRIGGER_FLOW_CONFIG['trigger:blur'];

const node = useNode<BlurTriggerFlowData>().node;
const data = reactive<ExtractData<BlurTriggerFlowData>>({
   selector: '',
});

// 将数据转换为可编辑的格式
watchEffect(() => {
   if (!node.data) return;
   data.selector = node.data.detail.selector;
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'trigger',
      detail: {
         type: 'blur',
         selector: data.selector,
      },
   };
});
</script>
