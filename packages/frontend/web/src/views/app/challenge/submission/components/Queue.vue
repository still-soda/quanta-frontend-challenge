<template>
   <div class="w-full flex flex-col items-center justify-center py-4 gap-4">
      <div
         class="relative overflow-hidden"
         :style="{
            width: `${(size + gap) * (boxCount + 1)}rem`,
            paddingBlock: `${gap}rem`,
         }">
         <div
            class="absolute bg-gradient-to-r from-white to-transparent left-0 z-20"
            :style="{ width: `${size}rem`, height: `${size}rem` }"></div>
         <div
            class="absolute bg-gradient-to-l from-white to-transparent right-0 z-20"
            :style="{ width: `${size}rem`, height: `${size}rem` }"></div>
         <div
            class="absolute border-[3px] border-dashed rounded-inside border-orange-high bg-orange-50"
            :style="{
               width: `${size + gap}rem`,
               height: `${size + gap}rem`,
               right: `${size + gap}rem`,
               marginRight: `-${gap / 2}rem`,
               marginTop: `-${gap / 2}rem`,
            }"></div>
         <div
            class="flex items-center flex-row-reverse transition-transform duration-500 ease-in-out z-10"
            :style="{
               width: `${(size + gap) * (boxCount + 1)}rem`,
               transform: `translateX(${rightOffset * (size + gap)}rem)`,
               gap: `${gap}rem`,
            }">
            <Box
               v-for="(task, idx) in boxes"
               class="transition-colors shrink-0"
               :style="{ width: `${size}rem`, height: `${size}rem` }"
               :key="idx"
               :class="{
                  'text-gray-400': !task.isMe,
                  'text-orange-high': task.isMe,
               }" />
         </div>
      </div>
      <div class="text-sm text-dark-to">
         {{
            prevCountStr === '0'
               ? '获取数据中...'
               : `前方还有 ${prevCountStr} 个提交`
         }}
      </div>
   </div>
</template>

<script setup lang="ts">
import { subscribePrevTaskCount } from '@/apis/tasks.api';
import { useMessage } from '@/components';
import { Box } from '@/components/Icons';
import { onUnmounted, ref, watchEffect } from 'vue';

const message = useMessage();
const boxCount = 10;
const size = 2;
const gap = 0.5;

// 暴露 props 和 emits
const props = defineProps<{
   /** 提交ID */
   submissionId: string;
   /** 是否启用 */
   enable?: boolean;
}>();

// 暴露 finished 事件，当排队完成时触发
const emits = defineEmits(['finished']);

// 动画箱子序列数据，用于模拟判题排队
interface Box {
   isMe: boolean;
}

const rightOffset = ref(0);
const boxes = ref<Box[]>(new Array(boxCount + 1).fill({ isMe: false }));

// 启动 EventSource 监听排队详情
let userOrder = -1;
let unsubscribe: Function | null = null;
const prevCountStr = ref('--');

watchEffect(() => {
   startListeningQueueUpdate();
});

async function startListeningQueueUpdate() {
   console.log(props.enable, props.submissionId, unsubscribe);
   if (!props.enable || !props.submissionId || unsubscribe) {
      return;
   }
   console.log(1);

   try {
      unsubscribe = await subscribePrevTaskCount({
         submissionsId: props.submissionId,
         onError: () => {
            message.error('判题排队状态更新失败', { duration: 3000 });
         },
         onMessage(count) {
            console.log(count);
            const prevCount = parseInt(count);
            userOrder === -1 && initBoxes(prevCount);

            // 更新箱子位置
            prevCountStr.value = prevCount.toString();
            rightOffset.value = userOrder - prevCount;

            // 判断是否完成
            if (prevCount <= 0) {
               console.log('finishied');
               unsubscribe && unsubscribe();
               emits('finished');
            }
         },
      });
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 初始化箱子
function initBoxes(startPrevCount: number) {
   userOrder = startPrevCount;
   boxes.value = new Array(startPrevCount + boxCount + 1)
      .fill(0)
      .map((_, idx) => ({ isMe: idx === userOrder + 1 }));
}

// 组件销毁时取消监听
onUnmounted(() => {
   unsubscribe && unsubscribe();
});
</script>
