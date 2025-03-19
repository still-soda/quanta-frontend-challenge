<template>
   <div class="p-4 flex gap-4">
      <BaseContainer
         no-header
         class="w-full h-full relative gap-[0.9375rem] overflow-hidden">
         <header class="flex gap-[0.625rem] pb-[0.625rem] -mt-[0.75rem]">
            <div
               @click="handleReturn"
               class="left-0 size-[2.5rem] shrink-0 rounded-[1rem] bg-green-base flex items-center justify-center text-white text-xl hover:scale-105 active:scale-95 hover:cursor-pointer transition-transform">
               <i class="fas fa-angle-left"></i>
            </div>
            <h1
               class="text-[1.5rem] text-transparent bg-clip-text bg-gradient-to-r from-dark-from to-dark-to w-fit font-semibold">
               提交记录
            </h1>
         </header>
         <div
            class="transition-all duration-300 ease-in-out"
            :style="{ height: `${mainContainerHeight}px` }">
            <main ref="main" class="mx-[2.25rem] flex flex-col gap-4">
               <div
                  class="px-[1.25rem] py-[1rem] flex flex-col gap-[0.875rem] rounded-lg border-[1px] border-dark-shallow">
                  <div class="flex gap-2 items-center">
                     <div class="text-[1.25rem] font-semibold">
                        <Skeleton v-if="loading">未通过</Skeleton>
                        <div
                           v-else-if="submission!.status === 'passed'"
                           class="text-green-base">
                           通过
                        </div>
                        <div
                           v-else-if="submission!.status === 'failed'"
                           class="text-red-base">
                           未通过
                        </div>
                        <div v-else class="text-orange-high">排队中</div>
                     </div>
                     <div class="text-dark-to text-[0.875rem]">
                        <Skeleton v-if="loading">通过 3 个测试点</Skeleton>
                        <div v-else>通过 {{ countTestpoint }} 个测试点</div>
                     </div>
                     <div class="text-dark-to text-[0.875rem] ml-auto">
                        <Skeleton v-if="loading">耗时 300ms</Skeleton>
                        <div v-else>耗时 {{ solution }} ms</div>
                     </div>
                  </div>
                  <div class="flex gap-3">
                     <img
                        :src="userStore.avatar"
                        :title="`${userStore.name}的头像`"
                        class="rounded-full size-[1.5rem] flex-shrink-0" />

                     <div>
                        <Skeleton v-if="loading">
                           <div
                              class="tracking-wide text-dark-normal text-[1rem]">
                              user 于 2021-09-09 12:00:00提交
                           </div>
                        </Skeleton>
                        <div
                           v-else
                           class="tracking-wide text-dark-normal text-[1rem] flex gap-1">
                           {{ userStore.name }}
                           <div class="text-[1rem]">
                              于
                              {{ formatDateTime(submission!.createdAt) }} 提交
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <Transition mode="out-in" name="main" class="relative">
                  <div v-if="!submission || submission.status !== 'pending'">
                     <Record
                        v-for="(data, idx) in recordData"
                        :prev-status="getPrevStatus(idx)"
                        :next-status="getNextStatus(idx)"
                        :data="data"
                        :key="idx" />
                  </div>
                  <div
                     v-else
                     class="pt-14 pb-12 w-full flex items-center justify-center">
                     <Queue
                        :enable="!!submission"
                        :submission-id="submission?._id || ''"
                        @finished="updateRecordData" />
                  </div>
               </Transition>
            </main>
         </div>
      </BaseContainer>
      <div>
         <div class="sticky top-4">
            <Result :submission="submission" />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { BaseContainer, useMessage, Skeleton } from '@/components';
import { useUserStore } from '@/stores/user.store';
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import Result from './components/Result.vue';
import Record from './components/Record.vue';
import { RecordData } from './components/record.type';
import { useRoute, useRouter } from 'vue-router';
import { getSubmissionById, getStaticFileMetadata } from '@challenge/api';
import { parseMessage } from './utils/parse-message.utils';
import { Submission } from '@challenge/api/models';
import { formatDateTime } from '@/utils/format-date.utils';
import Queue from './components/Queue.vue';

const SERVER_URL = import.meta.env.VITE_APP_API_BASE_URL;

const userStore = useUserStore();
const message = useMessage();
const route = useRoute();
const router = useRouter();

const removeGuard = router.beforeEach(() => {
   if (!route.query.id) {
      router.push('/challenge');
   }
});

onUnmounted(() => {
   removeGuard();
});

// 判题记录
const recordData = ref<RecordData[]>([]);
const submission = ref<Submission | null>(null);

// 获取判题记录
const loading = ref(true);

updateRecordData();
async function updateRecordData() {
   try {
      const submissionId = route.query.id as string;
      // 获取提交记录
      const { data } = await getSubmissionById(submissionId);
      submission.value = data;

      if (!submission) {
         message.error(`未找到ID为${submissionId}的提交记录`, {
            duration: 3000,
         });
         router.push('/challenge');
         return;
      }

      // 如果提交记录为 pending，则不获取判题记录
      if (submission.value.status === 'pending') {
         loading.value = false;
         return;
      }

      // 获取截图URL
      const screenshotsUrl = await getStaticFileMetadata(
         submission.value.screenshotIds
      ).then(({ data: metadatas }) => {
         return metadatas.map(
            (meta) => `${SERVER_URL}/static/${meta.localName}`
         );
      });

      // 映射判题记录
      recordData.value = parseMessage(submission.value.message).map((msg) => ({
         type: msg.type,
         text: msg.text,
         success: msg.success,
         score: msg.score,
         screenshot:
            msg.imgIndex === -1 ? undefined : screenshotsUrl[msg.imgIndex],
      }));

      loading.value = false;
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 获取前后状态
const getPrevStatus = (idx: number) => {
   if (idx === 0) {
      return 'none';
   }
   return recordData.value[idx].success ? 'success' : 'fail';
};
const getNextStatus = (idx: number) => {
   if (idx === recordData.value.length - 1) {
      return 'none';
   }
   return recordData.value[idx + 1].success ? 'success' : 'fail';
};

// 计算通过测试点数量
const countTestpoint = computed(() => {
   if (submission.value?.status === 'pending') return '--';
   return recordData.value.filter((record) => record.type === 'testpoint')
      .length;
});

// 计算解决时间
const solution = computed(() => {
   if (submission.value?.status === 'pending') return '--';
   return submission.value?.solution;
});

// 返回
function handleReturn() {
   if (submission.value) {
      const { challengeId } = submission.value;
      router.push(`/challenge/detail?id=${challengeId}&tab=1`);
   } else {
      router.push('/challenge');
   }
}

// 观察表格高度变化
const mainRef = useTemplateRef<HTMLDivElement>('main');
const mainContainerHeight = ref(0);
let observer: ResizeObserver;

onMounted(() => {
   observer = new ResizeObserver(() => {
      if (!mainRef.value) return;
      mainContainerHeight.value = mainRef.value.getBoundingClientRect().height;
   });
   mainRef.value && observer.observe(mainRef.value);
});

onUnmounted(() => {
   observer && observer.disconnect();
});
</script>

<style scoped>
.main-enter-active,
.main-leave-active {
   transition:
      opacity 0.3s,
      transform 0.3s,
      filter 0.3s;
}

.main-enter-from,
.main-leave-to {
   filter: blur(0.5rem);
   transform: scale(0.95);
   opacity: 0;
}

.main-enter-to {
   filter: blur(0);
   transform: scale(1);
   opacity: 1;
}
</style>
