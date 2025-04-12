<template>
   <div class="flex flex-col gap-4">
      <div class="card">
         <TRow class="justify-between w-full">
            <TButton shape="square" theme="default" @click="handleBack">
               <template #icon>
                  <TIcon name="chevron-left" />
               </template>
            </TButton>
            <TButton theme="primary" @click="handleSave" :loading="saving">
               <template #icon>
                  <TIcon name="save" />
               </template>
               保存
            </TButton>
         </TRow>
      </div>

      <div class="card">
         <TDescriptions
            title="挑战详情"
            class="w-full"
            bordered
            :label-style="{
               width: '150px',
               textAlign: 'center',
            }">
            <TDescriptionsItem
               v-for="(label, key) in labels"
               :key="key"
               :label="label.title">
               <div v-if="label.type === 'raw'">
                  {{ challenge[key as keyof typeof challenge] }}
               </div>

               <TInput
                  v-else-if="label.type === 'text'"
                  v-model="challenge[key as keyof typeof challenge]"
                  :disabled="label.readonly" />

               <TInputNumber
                  v-else-if="label.type === 'number'"
                  class="w-full"
                  v-model="challenge[key as keyof typeof challenge]"
                  :disabled="label.readonly" />

               <TSelect
                  v-else-if="label.type === 'select'"
                  v-model="challenge[key as keyof typeof challenge]"
                  :options="label.options"
                  :disabled="label.readonly" />

               <TSelect
                  v-else-if="label.type === 'pick'"
                  multiple
                  v-model="challenge[key as keyof typeof challenge]"
                  :max="2"
                  :options="label.options"
                  :disabled="label.readonly" />
            </TDescriptionsItem>

            <TDescriptionsItem label="挑战介绍" :span="2">
               <MdEditor v-model="detail" no-mermaid />
            </TDescriptionsItem>

            <TDescriptionsItem label="挑战图片" :span="2">
               <TUpload
                  v-model="files"
                  placeholder="最多只能上传 3 张图片"
                  theme="file-flow"
                  accept="image/*"
                  multiple
                  :max="3"
                  show-thumbnail></TUpload>
            </TDescriptionsItem>

            <TDescriptionsItem label="判题流程" :span="2">
               <div class="h-[28rem]">
                  <CustomFlow :ref="FLOW_KEY" v-model:flow-data="flowdata" />
               </div>
            </TDescriptionsItem>
         </TDescriptions>
      </div>

      <!-- <TCard :bordered="false">
         <div class="-mt-3">
            <TTypographyTitle level="h5">判题流程</TTypographyTitle>
         </div>
         <div class="h-[34rem]">
            <CustomFlow :ref="FLOW_KEY" v-model:flow-data="flowdata" />
         </div>
      </TCard> -->
   </div>
</template>

<script setup lang="ts">
import { useMessage } from '@/hooks/use-message.hook';
import { resolveDoc } from '@/utils/resolve-doc.utils';
import { adminGetChallengeById, adminGetChallengeDetail } from '@challenge/api';
import { IntegralChallenge } from '@challenge/api/models';
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MdEditor } from 'md-editor-v3';
import CustomFlow from '@/components/CustomFlow/index.vue';
import EMPTY_INTEGRAL_CHALLENGE from './empty-integral-challenge';
import { challengeInfoLabels } from './challenge-info-labels';
import 'md-editor-v3/lib/style.css';
import { useChallengeFlow } from '../composabals/use-challenge-flow';
import { FlowData } from '@challenge/core';

const route = useRoute();
const router = useRouter();
const message = useMessage();

// 文件
const files = ref<File[]>([]);

// 挑战内容
const detail = ref('Loading...');

// 拦截获取 Challenge ID
const challengeId = route.query.id as string;
if (typeof challengeId !== 'string') {
   message.error('未知 Challenge ID');
   router.push('/challenge/manage');
}

// 挑战信息标签
const labels = challengeInfoLabels;

// use 更新流程数据
const { updateChallengeFlow, FLOW_KEY } = useChallengeFlow();
const flowdata = ref<FlowData[]>([]);

// 获取 Challenge 详情
const challengeDetail = ref('');
const challengeImages = ref<string[]>([]);
const challenge = ref<IntegralChallenge>(EMPTY_INTEGRAL_CHALLENGE);

updateChallengeDetail();
async function updateChallengeDetail() {
   try {
      // 获取 Challenge 内容
      const detailRes = await adminGetChallengeDetail(challengeId);
      const { description, images } = resolveDoc(detailRes.data);
      challengeDetail.value = description;
      challengeImages.value = images.split('\n').map((s) => s.trim());
      // 获取 Challenge 详情
      const challengeRes = await adminGetChallengeById(challengeId);
      challenge.value = challengeRes.data;
      challenge.value.createdAt = new Date(challenge.value.createdAt!)
         .toLocaleString()
         .split('/')
         .join('-');
      updateChallengeFlow(challenge.value.flowdataId);
      (challenge.value as any).tags = challenge.value.tags.map((tag) => {
         return tag.name;
      });
      // 更新默认 detail 值
      if (detail.value === 'Loading...') {
         detail.value = challengeDetail.value;
      }
   } catch (error) {
      message.error('获取 Challenge 详情失败');
      handleBack();
   }
}

// 更新总得分
watchEffect(() => {
   challenge.value.score = flowdata.value.reduce((acc, cur: any) => {
      return acc + (cur.detail.score || 0);
   }, 0);
});

// 返回挑战管理页面
const handleBack = () => {
   router.push('/challenge/manage');
};

// 保存挑战
const saving = ref(false);
const handleSave = async () => {
   if (saving.value) return;
   saving.value = true;
   setTimeout(() => {
      message.success('保存成功');
      saving.value = false;
   }, 1000);
};
</script>
