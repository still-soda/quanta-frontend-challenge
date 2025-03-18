<template>
   <BaseContainer title="最近提交" class="w-[16.5rem]">
      <div class="flex flex-col gap-2 my-4">
         <div class="w-full flex justify-center my-[0.9rem]">
            <div
               class="grid grid-cols-3 gap-[0.375rem] items-center justify-center">
               <Success
                  v-for="i in successCount"
                  class="text-green-base appear"
                  :style="{ '--delay': i * 0.15 + 's' }"
                  :key="i" />
               <Fail
                  v-for="i in failCount"
                  class="text-red-shallow appear"
                  :style="{ '--delay': (i + successCount) * 0.15 + 's' }"
                  :key="i" />
               <Pending
                  v-for="i in pendingCount"
                  class="text-gray-300 appear"
                  :style="{ '--delay': i * 0.15 + 's' }"
                  :key="i" />
            </div>
         </div>
         <div class="w-full flex flex-col items-center gap-2 font-medium">
            <div>
               正确率：<span class="text-orange-high font-semibold">
                  {{ (percent * 100).toFixed(0) }}%
               </span>
            </div>
            <ProgressBar :color="progressbarColor" :percent="percent" />
            <div
               class="flex flex-col justify-center items-center text-xs mt-2.5">
               <div class="flex gap-1 items-center">
                  <Average />
                  <span>
                     平均通过率：{{ (averagePassedRate * 100).toFixed(0) }}%
                  </span>
               </div>
               <div class="flex gap-1 items-center">
                  <Thumb />
                  <span>
                     最高正确率：{{ (highestCorrectRate * 100).toFixed(0) }}%
                  </span>
               </div>
            </div>
         </div>
         <div
            class="mt-auto flex justify-center items-center text-xs text-gray-500 mb-2 pt-3.5">
            你实现的效果非常完美！
         </div>
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import { getChallengeById } from '@/apis/challenges.api';
import {
   getChallengePassedRate,
   getMaxCorrectRate,
   getMyRecentSubmission,
} from '@/apis/submissions.api';
import { BaseContainer, ProgressBar, useMessage } from '@/components';
import { Success, Fail, Pending, Average, Thumb } from '@/components/Icons';
import { computed, ref } from 'vue';

const message = useMessage();

// 提交数据
const percent = ref(0);
const successCount = ref(0);
const failCount = ref(0);
const pendingCount = ref(6);
const challengeId = ref('');
const status = ref('pending');

// 进度条颜色
const progressbarColor = computed(() => {
   if (status.value === 'passed') return '#94B889';
   if (status.value === 'failed') return '#FF6565';
   return '#FF9232';
});

// 更新提交数据
updateSubmissionData();
async function updateSubmissionData() {
   try {
      const { data: recentSubmission } = await getMyRecentSubmission();

      if (!recentSubmission) {
         status.value = 'pending';
         percent.value = 0;
         pendingCount.value = 6;
         successCount.value = failCount.value = 0;
         return;
      }

      challengeId.value = recentSubmission.challengeId;
      status.value = recentSubmission.status;

      challengeId.value && updateChallengeData();

      if (recentSubmission.status === 'pending') {
         percent.value = 0;
         pendingCount.value = 6;
         successCount.value = failCount.value = 0;
         return;
      }
      percent.value = recentSubmission.correctRate;
      successCount.value = Math.ceil(percent.value * 6);
      failCount.value = 6 - successCount.value;
      pendingCount.value = 0;
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 平均通过率和最高正确率
const averagePassedRate = ref(0);
const highestCorrectRate = ref(0);
const challengeTitle = ref('你还没有提交过答案');

// 更新挑战数据
async function updateChallengeData() {
   try {
      const {
         data: { rate: passedRate },
      } = await getChallengePassedRate(challengeId.value);
      averagePassedRate.value = passedRate;

      const { data: correctRate } = await getMaxCorrectRate(challengeId.value);
      highestCorrectRate.value = correctRate;

      const result = await getChallengeById(challengeId.value);
      const {
         data: { title },
      } = result;
      challengeTitle.value = title;
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}
</script>

<style scoped>
@keyframes appear {
   from {
      opacity: 0;
      transform: translateY(0.5rem);
   }
   to {
      opacity: 1;
      transform: translateY(0);
   }
}

.appear {
   opacity: 0;
   animation: appear 0.5s forwards;
   animation-delay: var(--delay);
}
</style>
