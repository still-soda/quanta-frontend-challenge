<template>
   <BaseContainer
      title="最新挑战"
      class="col-span-3 relative h-[24.4375rem] max-h-fit overflow-x-hidden">
      <template #extra>
         <Button type="link" class="text-xs text-gray-500 -mr-2">
            <RouterLink to="/challenge" class="flex items-center gap-0.5">
               查看更多<Go class="translate-y-[1px]" />
            </RouterLink>
         </Button>
      </template>
      <div
         class="flex relative flex-col gap-8 mt-4 mr-1 pb-5 px-3 h-full overflow-auto max-h-fit hide-scrollbar">
         <Notification
            v-for="(challenge, idx) in challenges"
            :key="challenge.id"
            :date="challenge.createdAt"
            :is-new="idx === 0"
            :tags="challenge.processedTags"
            :publisher-id="challenge.authorId"
            :language="challenge.type">
            <div class="gap-2 flex flex-col">
               <header class="flex gap-2 text-base px-1 mb-1">
                  <div class="flex gap-2 items-center">
                     <i class="fas fa-file-code text-orange-high"></i>
                     <h1 class="text-dark-normal text-sm font-semibold">
                        {{ challenge.title }}
                     </h1>
                  </div>
                  <div class="font-medium tracking-wider text-xs ml-auto">
                     {{ challenge.score }} &nbsp;points
                  </div>
               </header>
               <div class="ml-2">
                  <Markdown
                     class="text-[0.7rem]"
                     :raw-content="challenge.content" />
               </div>
            </div>
         </Notification>
      </div>
      <div
         class="absolute bottom-2 w-full text-center bg-gradient-to-t from-white via-white to-transparent h-8"></div>
   </BaseContainer>
</template>

<script setup lang="ts">
import { getLastestChallenges } from '@/apis/challenges.api';
import Notification from './components/Notification.vue';
import { Button, BaseContainer, useMessage, Markdown } from '@/components';
import { Go } from '@/components/Icons';
import { ref } from 'vue';
import { LatestChallenge } from '@/models/challenge.model';
import { resolveDoc } from '@/utils/resolve-doc.utils';
import { TAG_COLOR_MAPPING, TAG_TEXT_MAPPING } from '@/constant/tags.constant';

const message = useMessage();

type ChallengeWithTags = LatestChallenge & {
   processedTags: Record<string, string>;
};
const challenges = ref<ChallengeWithTags[]>([]);

// 更新最新挑战数据
updateChallengeData();
async function updateChallengeData() {
   try {
      const recentChallenges = await getLastestChallenges();
      // 处理数据
      challenges.value = recentChallenges.data.map((item) => {
         return {
            ...item,
            content: resolveDoc(item.content).description,
            createdAt: item.createdAt.split('T')[0].replace(/-/g, '.'),
            processedTags: {},
         };
      });
      // 处理标签
      challenges.value.forEach((challenge) => {
         challenge.tags.forEach((tag) => {
            const color = TAG_COLOR_MAPPING[tag] ?? 'gray';
            challenge.processedTags[color] = TAG_TEXT_MAPPING[tag] ?? tag;
         });
      });
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}
</script>

<style scoped></style>
