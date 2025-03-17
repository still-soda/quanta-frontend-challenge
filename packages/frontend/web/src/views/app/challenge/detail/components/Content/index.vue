<template>
   <div class="pl-4 pr-6 flex gap-7 flex-col">
      <header class="flex justify-between items-center">
         <Skeleton v-if="loading">
            <div class="text-[2rem] font-semibold">1. 这是骨架屏标题</div>
         </Skeleton>
         <div v-else class="text-[2rem] font-semibold">
            {{ challenge?.title }}
         </div>

         <div v-if="loading" class="flex gap-2">
            <Skeleton v-for="i in 2" :key="i">
               <Tag type="info" class="py-[0.25rem]">标签</Tag>
            </Skeleton>
         </div>
         <div v-else class="flex gap-2">
            <Tag
               v-for="tag in challenge?.tags"
               :key="tag._id"
               type="info"
               class="py-[0.25rem]"
               :style="{ backgroundColor: tag.color }">
               {{ tag.name }}
            </Tag>
         </div>
      </header>
      <div class="flex flex-col gap-3">
         <div class="flex gap-1.5 items-center">
            <Book />
            <div class="text-[1.5rem] font-semibold">题目描述</div>
         </div>
         <div class="pl-7 -mb-4">
            <Markdown
               class="text-[1rem]"
               :loading="loading"
               :raw-content="content" />
         </div>
      </div>

      <div class="flex flex-col gap-3">
         <div class="flex gap-1.5 items-center">
            <Image />
            <div class="text-[1.5rem] font-semibold">示例图片</div>
         </div>
         <div v-if="loading" class="flex gap-5 pl-7">
            <Skeleton v-for="i in 2" :key="i">
               <img class="size-[9.8125rem] rounded-sm" src="" alt="" />
            </Skeleton>
         </div>
         <div v-else class="flex gap-5 pl-7">
            <img
               v-for="url in images"
               class="h-[9.8125rem] rounded-sm"
               :src="`${url}`"
               alt="" />
         </div>
      </div>

      <div
         v-if="loading || answerFiles.length"
         class="flex flex-col gap-3 w-full">
         <div class="flex gap-1.5 items-center">
            <CloudDown />
            <div class="text-[1.5rem] font-semibold">附件下载</div>
         </div>

         <div v-if="loading" class="pl-7">
            <Skeleton class="w-full">
               <div class="h-[5.5rem] flex">
                  <div>X</div>
               </div>
            </Skeleton>
         </div>
         <div v-else class="flex flex-col gap-3 pl-7">
            <div
               v-for="url in answerFiles"
               class="flex gap-2 items-center px-[1.56rem] py-5 rounded-outside shadow-inside">
               <CodeFile />
               <div>
                  <div class="font-semibold">{{ getFileName(url) }}</div>
                  <div class="text-gray-500 tracking-tighter">1.25 KB</div>
               </div>
               <div
                  class="p-[0.62rem] aspect-square rounded-xl bg-orange-high hover:bg-orange-low transition-colors text-white ml-auto hover:cursor-pointer">
                  <Download />
               </div>
            </div>
         </div>
      </div>

      <div class="flex flex-col gap-3">
         <div class="flex gap-1.5 items-center">
            <Upload />
            <div class="text-[1.5rem] font-semibold">上传答案</div>
         </div>
         <div class="flex flex-col gap-3 pl-7">
            <Uploader accept="text/html" :max-file-counts="3" />
         </div>
      </div>

      <div>
         <Button class="w-fit ml-auto py-1.5" type="primary">提交答案</Button>
      </div>
   </div>
</template>

<script setup lang="ts">
import {
   getChallengeById,
   getChallengeDetail,
   getDownloadUrlOfAnswerTemplate,
} from '@/apis/challenges.api';
import {
   Tag,
   Button,
   Uploader,
   Markdown,
   Skeleton,
   useMessage,
} from '@/components';
import {
   Book,
   Image,
   CloudDown,
   Upload,
   CodeFile,
   Download,
} from '@/components/Icons';
import { Challenge } from '@/models/challenge.model';
import { resolveDoc } from '@/utils/resolve-doc.utils';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const SERVER_URL = import.meta.env.VITE_APP_API_BASE_URL;

// 获取挑战 ID，拦截无 ID 页面
let challengeId = route.query.id;

if (typeof challengeId !== 'string') {
   router.push('/challenge');
}

// 加载状态
const loading = ref(false);

// 挑战详情
const content = ref('');
const images = ref<string[]>([]);
const answerFiles = ref<string[]>([]);
const challenge = ref<Challenge>();

// 获取挑战详情
updateChallengeDetail();
async function updateChallengeDetail() {
   if (!challengeId || loading.value) return;
   loading.value = true;

   try {
      // 获取挑战
      const { data: challengeData } = await getChallengeById(
         challengeId as string
      );
      challenge.value = challengeData;

      // 获取挑战详情
      const { data: detail } = await getChallengeDetail(challengeId as string);

      const resolved = resolveDoc(detail);

      content.value = resolved.description;
      images.value = resolved.images
         .split('\n')
         .map((image) => SERVER_URL + image.trim());

      // 获取答案模板下载链接
      const { data: templates } = await getDownloadUrlOfAnswerTemplate(
         challengeId as string
      );
      answerFiles.value = templates;

      loading.value = false;
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

function getFileName(url: string) {
   return url.split('/').pop();
}
</script>
