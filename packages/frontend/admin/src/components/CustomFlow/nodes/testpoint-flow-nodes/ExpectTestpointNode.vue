<template>
   <BasicNode terminal="both">
      <template #head>
         <div class="flex gap-1 items-center font-semibold">
            <TIcon :name="headerConfig.icon" />
            {{ headerConfig.title }}
         </div>
      </template>

      <div class="flex flex-col my-2 gap-2">
         <TSpace direction="vertical" size="small" class="w-72">
            <TSpace direction="vertical" size="small" class="w-full">
               <TInput type="text" v-model="data.name" label="测试点名称" />
               <TInputNumber
                  type="number"
                  v-model="data.score"
                  :min="0"
                  :step="1"
                  class="w-72"
                  label="分数"></TInputNumber>
               <TSelect label="类型" default-value="exist" v-model="kind">
                  <TOption key="exist" label="存在性测试" value="exsist" />
                  <TOption key="attr" label="属性测试" value="attr" />
                  <TOption key="content" label="内容测试" value="content" />
                  <TOption key="style" label="样式测试" value="style" />
               </TSelect>
               期望：
               <TInput type="text" v-model="data.selector" label="选择器" />
            </TSpace>

            <TSpace
               direction="vertical"
               size="small"
               class="w-full"
               v-if="kind === 'exsist'">
               <TSelect default-value="exist" v-model="exist">
                  <TOption key="exist" label="存在" value="exist" />
                  <TOption key="not-exist" label="不存在" value="not-exist" />
               </TSelect>
            </TSpace>

            <TSpace
               direction="vertical"
               size="small"
               class="w-full"
               v-else-if="kind === 'attr'">
               <TInput type="text" v-model="data.attr" label="属性" />
               <TInput type="text" v-model="data.value" label="值" />
            </TSpace>

            <TSpace
               direction="vertical"
               size="small"
               class="w-full"
               v-else-if="kind === 'content'">
               <TInput type="text" v-model="data.text" label="文本" />
            </TSpace>

            <TSpace direction="vertical" size="small" class="w-full" v-else>
               <TSpace
                  size="small"
                  v-for="(_, index) in stylesEntry"
                  :key="index">
                  <TInput
                     type="text"
                     v-model="stylesEntry[index][0]"
                     placeholder="样式"
                     class="w-24" />
                  <TSelect
                     default-value="eq"
                     v-model="stylesEntry[index][1]"
                     class="w-20">
                     <TOption key="eq" label="等于" value="eq" />
                     <TOption key="ne" label="不等于" value="ne" />
                  </TSelect>
                  <TInput
                     type="text"
                     v-model="stylesEntry[index][2]"
                     placeholder="值"
                     class="w-24" />
               </TSpace>
               <TButton class="w-full" @click="addStyle">
                  <template #icon><TIcon name="plus" /></template>
                  添加样式
               </TButton>
            </TSpace>
         </TSpace>
      </div>
   </BasicNode>
</template>

<script setup lang="ts">
import { NodeProps, useNode } from '@vue-flow/core';
import BasicNode from '../BasicNode.vue';
import { reactive, ref, watchEffect } from 'vue';
import { ExpectTestpointFlowData } from '@challenge/core';
import { ExtractData } from '../../utils/extract-data.util';
import TESTPOINT_FLOW_CONFIG from './config';

defineProps<NodeProps<ExpectTestpointFlowData>>();

const headerConfig = TESTPOINT_FLOW_CONFIG['testpoint:expect'];

type ExpectKinds = 'exsist' | 'attr' | 'content' | 'style';

const kind = ref<ExpectKinds>('style');
const exist = ref('exist');
const node = useNode<ExpectTestpointFlowData>().node;
const data = reactive<ExtractData<ExpectTestpointFlowData>>({
   name: '',
   score: 0,
});
const stylesEntry = ref<[string, 'eq' | 'ne', string][]>([['', 'eq', '']]);

// 将数据转换为可编辑的格式
watchEffect(() => {
   data.name = node.data?.detail?.name ?? '';
   data.score = node.data?.detail?.score ?? 0;

   const { detail } = node.data;
   if (detail.exist !== undefined) {
      exist.value = detail?.exist ? 'exist' : 'not-exist';
      kind.value = 'exsist';
   } else if (detail.attr !== undefined) {
      data.attr = detail?.attr ?? '';
      data.value = detail?.value ?? '';
      kind.value = 'attr';
   } else if (detail.text !== undefined) {
      data.selector = detail?.selector ?? '';
      data.text = detail?.text ?? '';
      kind.value = 'content';
   } else {
      if (detail?.style) {
         stylesEntry.value = Object.entries(detail.style).map(
            ([key, { value, compare }]) => [key, compare, value]
         );
      }
      kind.value = 'style';
   }
});

// 将可编辑的格式转换为数据
watchEffect(() => {
   if (!node.data) return;
   node.data = {
      type: 'testpoint',
      detail: {
         type: 'expect',
         name: data.name,
         score: data.score,
      },
   };
   if (kind.value === 'exsist') {
      node.data.detail.exist = exist.value === 'exist';
   } else if (kind.value === 'attr') {
      node.data.detail.attr = data.attr;
      node.data.detail.value = data.value;
   } else if (kind.value === 'content') {
      node.data.detail.selector = data.selector;
      node.data.detail.text = data.text;
   } else if (kind.value === 'style') {
      node.data.detail.style = data.style;
   }
});

function addStyle() {
   stylesEntry.value.push(['', 'eq', '']);
}
</script>
