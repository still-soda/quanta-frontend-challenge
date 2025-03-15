<template>
   <div class="p-4 flex relative gap-[1.25rem]">
      <BaseContainer title="挑战排名" class="w-full">
         <template #title="{ title }">
            <div
               class="text-[1.5rem] font-bold bg-gradient-to-r bg-clip-text from-dark-from to-dark-to text-transparent">
               {{ title }}
            </div>
         </template>
         <template #extra>
            <div
               class="text-xs text-gray-400 h-full flex items-center tracking-tight">
               距离下次排行榜更新还有 {{ updateDate.day }} 天
               {{ updateDate.hour }} 小时 {{ updateDate.second }} 秒
            </div>
         </template>
         <div class="w-full text-gray-500 flex justify-between">
            <div>你当前的挑战排名为 {{ myRank }}</div>
            <div>
               <Button
                  @click="locateRank(myRank)"
                  type="secondary"
                  class="text-gray-500 border-gray-500 text-sm">
                  定位到当前排名
               </Button>
            </div>
         </div>
         <div ref="table">
            <Table
               :data="rankData"
               :order="['rank', 'avatar', 'name', 'score']"
               class="text-base mt-2 text-dark-normal">
               <template #head-rank>
                  <div class="w-full text-center order-2">排名</div>
               </template>
               <template #head-name>
                  <div class="w-full text-center order-1">名字</div>
               </template>
               <template #head-score>
                  <div class="w-full text-center">得分</div>
               </template>
               <template #head-avatar>
                  <div class="w-full text-center">头像</div>
               </template>

               <template #rank="{ value, idx }">
                  <div
                     class="text-center relative w-full"
                     :class="{
                        'text-orange-high font-bold': idx === myRank - 1,
                     }"
                     :id="`rank-${value}`">
                     <div
                        v-if="value <= 3"
                        class="absolute left-4"
                        :class="{
                           'text-orange-high': value === 1,
                           'text-gray-500': value === 2,
                           'text-yellow-700': value === 3,
                        }">
                        <Trophy />
                     </div>
                     {{ value }}
                  </div>
               </template>
               <template #name="{ value, idx }">
                  <div
                     class="text-center"
                     :class="{
                        'text-orange-high font-bold': idx === myRank - 1,
                     }">
                     {{ value }}
                  </div>
               </template>
               <template #score="{ value, idx }">
                  <div
                     class="text-center"
                     :class="{
                        'text-orange-high font-bold': idx === myRank - 1,
                     }">
                     {{ value }}
                  </div>
               </template>
               <template #avatar="{ value, idx }">
                  <div class="flex w-full justify-center">
                     <img
                        :src="value"
                        class="w-[2.125rem] rounded-full"
                        :class="{
                           'ring-2 ring-orange-high ring-offset-2':
                              idx === myRank - 1,
                        }" />
                  </div>
               </template>
            </Table>
         </div>
      </BaseContainer>
      <aside class="flex flex-col gap-[1.25rem] w-fit">
         <BaseContainer title="分数定位" class="w-[19.0625rem]">
            <BarChart
               :scores="scoreData"
               :users="myData"
               :image-size="18"
               height="11.5rem"
               width="16rem"
               class="my-5" />
            <div
               class="flex items-center justify-center text-dark-normal mb-1 -mt-1">
               <div class="flex items-start gap-1">
                  <span class="text-2xl font-semibold tracking-tighter">
                     {{ myScore }}
                  </span>
                  <span class="mt-1 text-sm text-gray-500">分</span>
               </div>
               <div class="w-[2px] h-6 my-1 mx-2 bg-gray-300 rounded-xl"></div>
               <div class="flex items-start gap-1">
                  <span class="mt-1 text-sm text-gray-500">击败</span>
                  <span class="text-2xl font-semibold tracking-tighter">
                     {{ overcomingPercent }}%
                  </span>
               </div>
            </div>
         </BaseContainer>
         <BaseContainer no-header class="w-[19.0625rem]">
            <div class="flex flex-col gap-[0.62rem]">
               <div class="flex gap-3" v-if="rabbitData.firstBlood">
                  <Trophy class="text-orange-high" />
                  <span>获得 {{ rabbitData.firstBlood }} 次一血</span>
               </div>
               <div class="flex gap-3" v-if="rabbitData.secondBlood">
                  <Trophy class="text-gray-500" />
                  <span>获得 {{ rabbitData.secondBlood }} 次二血</span>
               </div>
               <div class="flex gap-3" v-if="rabbitData.thirdBlood">
                  <Trophy class="text-yellow-700" />
                  <span>获得 {{ rabbitData.thirdBlood }} 次三血</span>
               </div>
            </div>
         </BaseContainer>

         <ReturnTop
            class="bottom-6 transition-opacity duration-300"
            :class="{
               'opacity-0 pointer-events-none': !showReturnTop,
               'opacity-100 pointer-events-auto': showReturnTop,
            }" />
      </aside>
   </div>
</template>

<script setup lang="ts">
import {
   BaseContainer,
   BarChart,
   Button,
   Table,
   ReturnTop,
   useMessage,
} from '@/components';
import { Trophy } from '@/components/Icons';
import { inject, onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import { shiftDate, dateToObject } from '@challenge/utils';
import { useUserStore } from '@/stores/user.store';
import {
   getMyHistoryRank,
   getOvercomingPercent,
   getRecentRank,
} from '@/apis/rank.api';
import { getDefaultAvatar, getUserById } from '@/apis/user.api';
import { svgToBase64 } from '@/adapters/svgToBase64.adapters';
import { getEarlisetResolvedChallengesOfUser } from '@/apis/resolved.api';

const userStore = useUserStore();
const message = useMessage();

// 更新排行榜数据和分数数据
interface RankData {
   name: string;
   score: number;
   avatar: string;
   rank: number;
}
const rankData = ref<RankData[]>([]);
const scoreData = ref<{ score: number }[]>([]);

updateRankData();
async function updateRankData() {
   try {
      const { data: rank } = await getRecentRank();
      // 更新分数数据
      scoreData.value = rank.map((item) => ({ score: item.score }));
      // 获取用户名和头像
      const userInfo = await Promise.all(
         rank.map(async ({ userId }) => {
            return getUserById(userId).then(async (user) => {
               const avatar =
                  user.data.avatar ||
                  svgToBase64((await getDefaultAvatar(userId)).data.avatar);
               return {
                  name: user.data.username,
                  avatar: avatar,
               };
            });
         })
      );
      // 合并并更新数据
      rankData.value = rank.map((item, index) => ({
         rank: item.rank,
         score: item.score,
         ...userInfo[index],
      }));
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 我的数据
interface MyData {
   score: number;
   avatar: string;
}
const myData = ref<MyData[]>([]);
const myScore = ref(0);

watch(
   () => userStore.totalScore,
   () => {
      const score = userStore.totalScore;
      const avatar = userStore.avatar;
      myData.value = [{ score, avatar }];
      myScore.value = score;
      console.log(myData.value);
   },
   { immediate: true }
);

// 更新我的排名
const myRank = ref(0);

updateMyRank();
async function updateMyRank() {
   try {
      const {
         data: { history },
      } = await getMyHistoryRank();
      myRank.value = history[history.length - 1].rank;
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 获取超过多少用户
const overcomingPercent = ref(0);

updateOvercomingPercent();
async function updateOvercomingPercent() {
   try {
      const {
         data: { total, lower },
      } = await getOvercomingPercent();
      overcomingPercent.value = Math.round((lower / (total - 1)) * 100);
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 获取兔子数据
interface RabbitData {
   firstBlood: number;
   secondBlood: number;
   thirdBlood: number;
}
const rabbitData = ref<RabbitData>({
   firstBlood: 0,
   secondBlood: 0,
   thirdBlood: 0,
});

async function updateRabbitData() {
   if (!userStore.id) {
      return;
   }

   try {
      const { data } = await getEarlisetResolvedChallengesOfUser(userStore.id);
      rabbitData.value = {
         firstBlood: 0,
         secondBlood: 0,
         thirdBlood: 0,
      };
      data.forEach((item) => {
         if (item.rank === 1) {
            rabbitData.value.firstBlood++;
         } else if (item.rank === 2) {
            rabbitData.value.secondBlood++;
         } else if (item.rank === 3) {
            rabbitData.value.thirdBlood++;
         }
      });
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

watch(
   () => userStore.id,
   () => updateRabbitData(),
   { immediate: true }
);

// 延迟时间
const delayedDate = shiftDate(new Date(), { days: 3, hours: 5 });
const updateDate = ref(
   dateToObject(new Date(delayedDate.getTime() - Date.now()))
);

// 返回顶部按钮
const showReturnTop = ref(false);
const table = ref<HTMLElement | null>(null);
const navigatorHeight = inject('navigatorHeight') as Ref<number>;

// 检查头部是否可见，用于显示返回顶部按钮
function checkHeaderVisibility() {
   if (!table.value) {
      return;
   }
   const tableTop = table.value.getBoundingClientRect().top;
   showReturnTop.value = navigatorHeight.value > tableTop;
}

onMounted(() => {
   window.addEventListener('scroll', checkHeaderVisibility);
});

onUnmounted(() => {
   window.removeEventListener('scroll', checkHeaderVisibility);
});

// 定位到当前排名
function locateRank(rank: number) {
   const element = document.getElementById(`rank-${rank - 1}`);
   if (element) {
      element.scrollIntoView({
         behavior: 'smooth',
      });
   }
}
</script>
