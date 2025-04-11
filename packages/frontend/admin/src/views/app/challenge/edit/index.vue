<template>
   <div class="flex flex-col gap-4">
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
         </TDescriptions>
      </div>
   </div>
</template>

<script setup lang="ts">
import { useMessage } from '@/hooks/use-message.hook';
import { resolveDoc } from '@/utils/resolve-doc.utils';
import { adminGetChallengeById, adminGetChallengeDetail } from '@challenge/api';
import { IntegralChallenge } from '@challenge/api/models';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const message = useMessage();

// 拦截获取 Challenge ID
const challengeId = route.query.id as string;
if (typeof challengeId !== 'string') {
   message.error('未知 Challenge ID');
   router.push('/challenge/manage');
}

// 获取 Challenge 详情
const challengeDetail = ref('');
const challengeImages = ref<string[]>([]);
const challenge = ref<IntegralChallenge>({
   id: '',
   title: '',
   createdAt: '',
   updatedAt: '',
   status: 0,
   answerTemplate: [],
   authorId: '',
   contentId: '',
   difficulty: '',
   fastestSolvers: [],
   score: 0,
   screenshots: [],
   tags: [],
   standardAnswer: [],
   totalPass: 0,
   totalSubmissions: 0,
   type: '',
});

interface Labels {
   [key: string]:
      | {
           title: string;
           type: 'text' | 'number' | 'raw';
           readonly?: boolean;
        }
      | {
           title: string;
           type: 'select' | 'pick';
           options: { label: string; value: string }[];
           readonly?: boolean;
        };
}
const labels: Labels = {
   id: {
      title: '挑战 ID',
      type: 'raw',
      readonly: true,
   },
   createdAt: {
      title: '创建时间',
      type: 'raw',
      readonly: true,
   },
   title: {
      title: '挑战标题',
      type: 'text',
   },
   difficulty: {
      title: '难度',
      type: 'select',
      options: [
         { label: '简单', value: 'easy' },
         { label: '中等', value: 'medium' },
         { label: '困难', value: 'hard' },
      ],
   },
   score: {
      title: '分数',
      type: 'number',
   },
   type: {
      title: '类型',
      type: 'text',
   },
   tags: {
      title: '标签',
      type: 'pick',
      options: [
         { label: 'Web', value: 'web' },
         { label: 'Crypto', value: 'crypto' },
         { label: 'Pwn', value: 'pwn' },
         { label: 'Reversing', value: 'reversing' },
         { label: 'Misc', value: 'misc' },
         { label: 'Forensics', value: 'forensics' },
         { label: 'OSINT', value: 'osint' },
         { label: 'Steganography', value: 'steganography' },
      ],
   },
};

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
      (challenge.value as any).tags = challenge.value.tags.map((tag) => {
         return tag.name;
      });
   } catch (error) {
      message.error('获取 Challenge 详情失败');
      handleBack();
   }
}

// 返回挑战管理页面
const handleBack = () => {
   router.push('/challenge/manage');
};
</script>
