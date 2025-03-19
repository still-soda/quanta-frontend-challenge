<template>
   <Table :data="historyData" :order="tableOrder" class="mb-2 h-fit">
      <template #cols>
         <col style="width: 12%" />
         <col style="width: 28%" />
         <col style="width: 12%" />
         <col v-for="_ in 2" style="width: 24%" />
      </template>
      <template #header="{ key }">
         <div class="translate-x-1">{{ (header as any)[key] }}</div>
      </template>
      <template #status="{ value }">
         <div class="flex gap-2 items-center">
            <Check class="text-green-base" v-if="value === 'done'" />
            <Close class="text-red-shallow" v-else-if="value === 'error'" />
            <Reduce class="text-orange-high" v-else />
         </div>
      </template>
      <template #id="{ idx }">
         <Button
            type="link"
            :disabled="historyData[idx].status === 'pending'"
            class="!px-0 !border-none">
            <RouterLink :to="submissionDetailUrl(idx)">查看详情</RouterLink>
         </Button>
      </template>
   </Table>
</template>

<script setup lang="ts">
import { getMySubmissionsInChallenge } from '@challenge/api';
import { Table, Button, useMessage } from '@/components';
import { Check, Close, Reduce } from '@/components/Icons';
import { formatDateTime } from '@/utils/format-date.utils';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();
const route = useRoute();

const tableOrder = ['status', 'dateTime', 'score', 'detail', 'id'];
const header = {
   status: '状态',
   dateTime: '提交时间',
   score: '得分',
   detail: '详情',
   id: '操作',
};

// 历史提交数据
interface HistoryData {
   id: string;
   status: 'done' | 'error' | 'pending';
   dateTime: string;
   score: number;
   detail: string;
}

const historyData = ref<HistoryData[]>([]);
const challengeId = route.query.id;

// 更新历史提交数据
updateHistoryData();
async function updateHistoryData() {
   if (typeof challengeId !== 'string') {
      router.push('/challenge');
      return;
   }

   try {
      const res = await getMySubmissionsInChallenge(challengeId);
      // 按时间降序排序
      res.data.sort(
         (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      // 映射数据
      historyData.value = res.data.map((item) => ({
         id: item._id,
         status: mapStatus(item.status),
         dateTime: formatDateTime(item.createdAt),
         score: item.score,
         detail: mapDetail(item.message, item.score),
      }));
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 映射作答详情
function mapDetail(message: string, score: number) {
   message && score;
   return '非常完美';
}

// 映射状态
function mapStatus(status: string) {
   if (status === 'passed') return 'done';
   if (status === 'failed') return 'error';
   return 'pending';
}

// 获取提交详情的 URL
function submissionDetailUrl(idx: number) {
   return historyData.value[idx].status === 'pending'
      ? ''
      : `/challenge/submission?id=${historyData.value[idx].id}`;
}
</script>
