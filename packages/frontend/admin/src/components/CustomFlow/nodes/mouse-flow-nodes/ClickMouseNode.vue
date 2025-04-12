<template>
   <BasicNode terminal="both">
      <template #head>
         <div class="flex gap-1 items-center font-semibold">
            <TIcon :name="headerConfig.icon" />
            {{ headerConfig.title }}
         </div>
      </template>

      <div class="flex flex-col my-2 gap-2">
         <div class="w-52 flex flex-col gap-2">
            <TSelect
               label="类型"
               default-value="click"
               v-model="type"
               size="small">
               <TOption key="click" label="单击" value="click" />
               <TOption key="dbclick" label="双击" value="dbclick" />
            </TSelect>

            <TSelect
               label="键位"
               default-value="left"
               v-model="data.button"
               size="small">
               <TOption key="left" label="左键" value="left" />
               <TOption key="middle" label="中键" value="middle" />
               <TOption key="right" label="右键" value="right" />
            </TSelect>
         </div>

         <div class="w-52">
            点击：
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
import { ClickMouseFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import MOUSE_FLOW_CONFIG from './config';

defineProps<NodeProps<ClickMouseFlowData>>();

const headerConfig = MOUSE_FLOW_CONFIG['mouse:click'];

const kind = ref('point');
const type = ref<'click' | 'dbclick'>('click');
const node = useNode<ClickMouseFlowData>().node;
const data = reactive<ExtractData<ClickMouseFlowData>>({});

// 将数据转换为可编辑的格式
watchEffect(() => {
   if (!node.data) return;
   data.button = node.data.detail.button;
   data.x = node.data.detail.x;
   data.y = node.data.detail.y;
   data.selector = node.data.detail.selector;
   kind.value =
      typeof node.data.detail.selector === 'string' ? 'selector' : 'point';
   type.value = node.data.detail.type as 'click' | 'dbclick';
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'mouse',
      detail: { type: type.value },
   };
   if (kind.value === 'point') {
      node.data.detail = {
         type: type.value,
         button: data.button,
         x: data.x,
         y: data.y,
      };
   } else {
      node.data.detail = {
         type: type.value,
         button: data.button,
         selector: data.selector ?? '',
      };
   }
});
</script>
