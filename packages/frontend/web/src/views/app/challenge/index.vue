<template>
   <BaseContainer class="m-4" no-header>
      <div class="flex gap-2 p-[0.62rem] items-center">
         <div class="text-xl">筛选：</div>
         <Filter />
      </div>
      <div class="flex gap-2 p-[0.62rem] items-center">
         <div class="text-xl">分类：</div>
         <Category v-model:selected="selectedTagIds" />
      </div>
      <div class="mx-[1.88rem] text-dark-normal">
         <Table :data="data" :order="tableOrder" :get-key="(item) => item.id">
            <template #cols>
               <col style="width: 8.5rem" />
               <col style="width: max-content" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
               <col style="width: 8.7rem" />
            </template>
            <template #header="{ key }">
               <div class="flex justify-between items-center">
                  <span>
                     {{ tableHead[key] }}
                  </span>
                  <div
                     v-if="sortables.includes(key as any)"
                     @click="sort(key)"
                     class="-translate-x-2 hover:cursor-pointer hover:scale-105 transition-transform active:scale-95">
                     <Sort />
                  </div>
               </div>
            </template>

            <template #status="{ value, idx }">
               <div
                  v-if="!loadingUserStatus"
                  class="flex gap-2 items-center shrink-0 w-8">
                  <div v-if="value === 'done'" class="size-6">
                     <Check class="text-green-base size-6" />
                  </div>
                  <div v-else-if="value === 'error'" class="size-6">
                     <Close class="text-red-shallow size-6" />
                  </div>
                  <div
                     v-if="data[idx].top !== 0 && value === 'done'"
                     class="size-6">
                     <Trophy
                        class="translate-y-[0.1rem]"
                        :class="{
                           'text-orange-high': data[idx].top === 1,
                           'text-gray-500': data[idx].top === 2,
                           'text-yellow-700': data[idx].top === 3,
                        }" />
                  </div>
               </div>
               <Skeleton v-else type="text">
                  {{ randomLength(8, 8) }}
               </Skeleton>
            </template>

            <template #name="{ value, idx }">
               <Button
                  v-if="!loadingMainData"
                  type="link"
                  class="w-full max-w-72 text-nowrap py-1 font-medium px-0 overflow-hidden whitespace-nowrap overflow-ellipsis">
                  <RouterLink :to="`/challenge/detail?id=${data[idx].id}`">
                     {{ data[idx].number }}.
                     {{ value }}
                  </RouterLink>
               </Button>
               <Skeleton v-else type="text">
                  <Button
                     type="link"
                     class="w-full max-w-72 text-nowrap py-1 font-medium px-0 overflow-hidden whitespace-nowrap overflow-ellipsis">
                     <RouterLink :to="`/challenge/detail?id=${data[idx].id}`">
                        {{ randomLength(8, 12) }}
                     </RouterLink>
                  </Button>
               </Skeleton>
            </template>

            <template #correctRate="{ value }">
               <div v-if="!loadingUserStatus">
                  {{ (value * 100).toFixed(2) }}%
               </div>
               <Skeleton v-else type="text">
                  {{ randomLength(4, 7) }}
               </Skeleton>
            </template>

            <template #difficulty="{ value }">
               <div
                  v-if="!loadingMainData"
                  :class="{
                     'text-green-base': value === '简单',
                     'text-orange-high': value === '中等',
                     'text-red-shallow': value === '困难',
                  }">
                  {{ value }}
               </div>
               <Skeleton v-else type="text">
                  {{ randomLength(8, 8) }}
               </Skeleton>
            </template>

            <template #tags="{ value }">
               <div v-if="!loadingMainData" class="flex gap-2">
                  <Tag
                     v-for="tag in value"
                     :key="tag"
                     :style="{ backgroundColor: tag.color }"
                     type="info"
                     class="py-[0.25rem]">
                     {{ tag.name }}
                  </Tag>
               </div>
               <Skeleton v-else type="text">
                  <Tag class="py-[0.25rem]">
                     {{ randomLength(3, 4) }}
                  </Tag>
               </Skeleton>
            </template>

            <template #submitCount="{ value }">
               <div v-if="!loadingMainData">
                  {{ value }}
               </div>
               <Skeleton v-else type="text">
                  {{ randomLength(4, 7) }}
               </Skeleton>
            </template>
         </Table>
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import {
   BaseContainer,
   Table,
   Tag,
   Button,
   useMessage,
   Skeleton,
} from '@/components';
import { Check, Close, Trophy, Sort } from '@/components/Icons';
import Filter from './components/Filter.vue';
import Category from './components/Category.vue';
import { ref, watch, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { CompareChain } from '@challenge/utils';
import { getAllPublishedChallenges } from '@/apis/challenges.api';
import { Challenge } from '@/models/challenge.model';
import { TAG_TEXT_MAPPING } from '@/constant/tags.constant';
import { useUserStore } from '@/stores/user.store';
import { getEarlisetResolvedChallengesOfUser } from '@/apis/resolved.api';
import { ResolvedChallenge } from '@/models/resolved-challenge.model';
import { Tag as TagType } from '@/models/tag.model';

const message = useMessage();
const userStore = useUserStore();

// 选中的标签
const selectedTagIds = ref<string[]>([]);

// 随机骨架宽度
function randomLength(from: number, to: number) {
   return new Array(Math.ceil(from + (to - from) * Math.random()))
      .fill('X')
      .join('');
}

const tableOrder = [
   'status',
   'name',
   'submitCount',
   'correctRate',
   'difficulty',
   'score',
   'tags',
];

const tableHead = {
   status: '状态',
   name: '题目',
   submitCount: '提交次数',
   correctRate: '正确率',
   difficulty: '难度',
   score: '分数',
   tags: '标签',
} as { [key: string]: string };

const sortables = ['submitCount', 'correctRate', 'score'] as const;

const sortedStatus = {
   submitCount: 0,
   correctRate: 0,
   score: 0,
   difficulty: 0,
};

// 多级排序，详情见 compare-chain.utils.ts
const chain = new CompareChain<any>();
function sort(key?: string) {
   const k = key as keyof typeof sortedStatus;
   if (sortedStatus[k] === 0 || sortedStatus[k] === -1) {
      sortedStatus[k] = 1;
   } else if (sortedStatus[k] === 1) {
      sortedStatus[k] = -1;
   }
   chain.reset();

   const statusOrder = ['done', 'error', ''];
   chain.toCompare((a, b) => {
      return (
         statusOrder.indexOf(a['status']) - statusOrder.indexOf(b['status'])
      );
   });

   Object.entries(sortedStatus).forEach(([name, sortedBy]) => {
      if (sortedBy === 0) {
         return;
      } else if (sortedBy === 1) {
         if (name === 'difficulty') {
            chain.toCompare((a, b) => {
               const order = ['简单', '中等', '困难'];
               return order.indexOf(a[name]) - order.indexOf(b[name]);
            });
         } else {
            chain.toCompare((a, b) => a[name] - b[name]);
         }
      } else if (sortedBy === -1) {
         if (name === 'difficulty') {
            chain.toCompare((a, b) => {
               const order = ['简单', '中等', '困难'];
               return order.indexOf(b[name]) - order.indexOf(a[name]);
            });
         } else {
            chain.toCompare((a, b) => b[name] - a[name]);
         }
      }
   });
   data.value = chain.toSort(data.value);
}

// 表格数据
interface TableData {
   name: string;
   id: string;
   correctRate: number;
   difficulty: string;
   tags: TagType[];
   status: string;
   top: number;
   score: number;
   submitCount: number;
   number: number;
}
const data = ref<TableData[]>(Array(15).fill({}) as TableData[]);

// 加载状态
const loadingMainData = ref(true);
const loadingUserStatus = ref(true);

// 更新表格数据
let publishedChallenges: Challenge[] = [];

watchEffect(() => {
   updateData();
});

async function updateData() {
   try {
      // 获取所有题目
      const result = await getAllPublishedChallenges({
         all: selectedTagIds.value,
      });
      publishedChallenges = result.data;

      // 映射数据
      data.value = publishedChallenges.map((item, idx) => {
         const correctRate =
            item.totalSubmissions === 0
               ? 0
               : item.totalPass / item.totalSubmissions;
         return {
            name: item.title,
            id: item.id,
            correctRate: correctRate,
            difficulty: TAG_TEXT_MAPPING[item.difficulty] ?? item.difficulty,
            tags: item.tags,
            status: '',
            top: 0,
            score: item.score,
            submitCount: item.totalSubmissions,
            number: idx + 1,
         };
      });

      // 加载完成
      loadingMainData.value = false;
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 监听数据变化
watchEffect(() => {
   sort();
});

// 更新状态
let earlisetResolvedChallenges: ResolvedChallenge[] | null = null;

watch(
   () => [userStore.solvedChallenges, data.value],
   async () => {
      if (!userStore.id || loadingMainData.value) {
         return;
      }

      // 获取用户通过的题目
      if (!earlisetResolvedChallenges) {
         try {
            const result = await getEarlisetResolvedChallengesOfUser(
               userStore.id
            );
            earlisetResolvedChallenges = result.data;
         } catch (error: any) {
            message.error(error.message, { duration: 3000 });
         }
      }

      // 更新状态
      data.value.forEach((item) => {
         const challenge = publishedChallenges.find(
            (challenge) => challenge.id === item.id
         );
         if (challenge) {
            // 判断是否通过
            const passed = userStore.solvedChallenges.includes(challenge.id);
            const failed = userStore.failedChallenges.includes(challenge.id);
            failed && (item.status = 'error');
            passed && (item.status = 'done');

            // 判断是否前三
            const top = earlisetResolvedChallenges!.find(
               (resolved) => resolved.challengeId === challenge.id
            );
            top && (item.top = top.rank);
         }
      });

      // 加载完成
      loadingUserStatus.value = false;
   }
);
</script>
