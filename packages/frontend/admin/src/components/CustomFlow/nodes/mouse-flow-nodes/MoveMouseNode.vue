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
            到：
            <TRadioGroup
               defaultValue="point"
               v-model="kind"
               size="small"
               theme="button">
               <TRadio value="point" label="坐标" />
               <TRadio value="selector" label="选择器" />
            </TRadioGroup>
         </div>

         <div class="w-52">
            <TSpace
               v-if="kind === 'point'"
               direction="vertical"
               size="small"
               class="w-full">
               <TInput type="number" v-model="data.x" label="X"></TInput>
               <TInput type="number" v-model="data.y" label="Y"></TInput>
            </TSpace>
            <TSpace v-else direction="vertical" size="small" class="w-full">
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
import { reactive, ref, watchEffect } from 'vue';
import { MoveMouseFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import MOUSE_FLOW_CONFIG from './config';

defineProps<NodeProps<MoveMouseFlowData>>();

const headerConfig = MOUSE_FLOW_CONFIG['mouse:move'];

const kind = ref('point');
const node = useNode<MoveMouseFlowData>().node;
const data = reactive<ExtractData<MoveMouseFlowData>>({});

// 将数据转换为可编辑的格式
watchEffect(() => {
   if (!node.data) return;
   data.x = node.data.detail.x;
   data.y = node.data.detail.y;
   data.selector = node.data.detail.selector;
   kind.value = node.data.detail.selector ? 'selector' : 'point';
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'mouse',
      detail: { type: 'move' },
   };
   if (kind.value === 'point') {
      node.data.detail = {
         type: 'move',
         x: data.x,
         y: data.y,
      };
   } else {
      node.data.detail = {
         type: 'move',
         selector: data.selector,
      };
   }
});
</script>
