<template>
   <BaseContainer title="挑战得分">
      <div class="flex flex-col items-center h-full justify-between">
         <RingChart
            thickness="0.7rem"
            width="10.4375rem"
            class="w-full h-full text-orange-high my-auto"
            :percent="percent">
            <template #icon>
               <Fire class="size-16" />
            </template>
            <template #text>
               <span class="text-[1.5rem] text-red-base">
                  {{ userStoreRefs.totalScore }}
               </span>
            </template>
         </RingChart>
         <div class="text-xs px-1 text-center text-gray-500 w-[8.5rem]">
            排名将会根据得分在每周一凌晨1点刷新
         </div>
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import { getChallengesTotalScore } from '@/apis/challenges.api';
import { BaseContainer, RingChart, useMessage } from '@/components';
import { Fire } from '@/components/Icons';
import { useUserStore } from '@/stores/user.store';
import { ref, watch } from 'vue';

const message = useMessage();
const userStoreRefs = useUserStore();
const percent = ref(0);

watch(
   () => userStoreRefs.totalScore,
   async () => {
      try {
         const { data: totalScore } = await getChallengesTotalScore();
         console.log(userStoreRefs.totalScore, totalScore);
         percent.value =
            totalScore === 0 ? 1 : userStoreRefs.totalScore / totalScore;
      } catch (error: any) {
         message.error(error.message, { duration: 3000 });
      }
   },
   { immediate: true }
);
</script>
