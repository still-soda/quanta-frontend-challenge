<template>
   <div class="relative w-full h-full">
      <canvas
         ref="canvas"
         class="w-full h-full relative z-0"
         :class="{
            'cursor-move': hovered,
         }"></canvas>
      <div ref="pointLT" class="point-container">
         <slot>
            <div class="template-point"></div>
         </slot>
      </div>
      <div ref="pointRT" class="point-container">
         <slot>
            <div class="template-point"></div>
         </slot>
      </div>
      <div ref="pointLB" class="point-container">
         <slot>
            <div class="template-point"></div>
         </slot>
      </div>
      <div ref="pointRB" class="point-container">
         <slot>
            <div class="template-point"></div>
         </slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
   generateDarkImage,
   drawParticalImage,
   drawImage,
   drawSplitLines,
} from './draw.core';

interface Range {
   from: [number, number];
   to: [number, number];
}

// DOM
const canvas = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const pointLT = ref<HTMLDivElement | null>(null);
const pointRT = ref<HTMLDivElement | null>(null);
const pointLB = ref<HTMLDivElement | null>(null);
const pointRB = ref<HTMLDivElement | null>(null);

const image = ref<HTMLImageElement | null>(null);
const drakImage = ref<HTMLImageElement | null>(null);

const canvasWidth = ref(0);
const canvasHeight = ref(0);
const renderFlag = ref(true);
const needRerender = ref(true);
const hovered = ref(false);

const range = ref<Range>({
   from: [0, 0],
   to: [0, 0],
});
const selectRange = ref<Range>({
   from: [0, 0],
   to: [0, 0],
});

// Props
const props = defineProps<{
   imageSrc: string;
   aspectRatio?: number;
   noSplitLines?: boolean;
}>();

// 初始化
onMounted(() => {
   if (!canvas.value) return;

   // 设置画布尺寸，获取2D上下文
   const { width, height } = canvas.value.getBoundingClientRect();
   canvasWidth.value = width;
   canvasHeight.value = height;

   canvas.value.width = width * devicePixelRatio;
   canvas.value.height = height * devicePixelRatio;
   canvas.value.style.width = `${width}px`;
   canvas.value.style.height = `${height}px`;

   const ctx = canvas.value.getContext('2d');
   if (!ctx) return;
   context.value = ctx;

   // 绑定控制点事件
   if (!pointLT.value || !pointRT.value || !pointLB.value || !pointRB.value)
      return;

   const points = {
      lt: pointLT.value,
      lb: pointLB.value,
      rt: pointRT.value,
      rb: pointRB.value,
   };
   Object.entries(points).forEach(([which, point]) => {
      point.addEventListener('mousedown', (e) =>
         handleMouseDown(e, which as any)
      );
      point.addEventListener('touchstart', (e) => {
         e.preventDefault();
         handleMouseDown(e.touches[0] as any as MouseEvent, which as any);
      });
      point.addEventListener('dragstart', (e) => e.preventDefault());
   });

   // 加载图片
   image.value = new Image();
   image.value.onload = () => {
      if (!context.value) return;

      // 获取尺寸
      const apsectRatio = image.value!.width / image.value!.height;
      let width, height, startX, startY;
      if (apsectRatio > 1) {
         width = canvas.value!.width;
         height = width / apsectRatio;
         startX = 0;
         startY = (canvas.value!.height - height) / 2;
      } else {
         height = canvas.value!.height;
         width = height * apsectRatio;
         startY = 0;
         startX = (canvas.value!.width - width) / 2;
      }

      const from: [number, number] = [startX, startY];
      const to: [number, number] = [startX + width, startY + height];

      range.value.from = [from[0], from[1]];
      range.value.to = [to[0], to[1]];
      selectRange.value.from = [from[0], from[1]];
      selectRange.value.to = [to[0], to[1]];

      setControlPointPosition(from, to);

      // 创建低亮度图片
      drakImage.value = generateDarkImage(image.value!, 0.5);

      // 开启更新
      requestAnimationFrame(update);
   };
   image.value!.src = props.imageSrc;
});

// 处理组件卸载
onUnmounted(() => {
   renderFlag.value = false;
});

// 渲染循环
function update() {
   if (!context.value || !image.value || !drakImage.value) return;

   if (renderFlag.value) {
      requestAnimationFrame(update);
      if (!needRerender.value) {
         return;
      } else {
         needRerender.value = false;
      }
   }

   const crossPosition = getCrossPosition();

   // 约束裁切盒子的宽高比
   if (props.aspectRatio) {
      const { from, to } = selectRange.value;
      const width = to[0] - from[0];
      const oldCrossPos = getCrossPosition();

      to[1] = from[1] + width / props.aspectRatio;

      let delta = 0;
      if (to[1] > range.value.to[1]) {
         delta = range.value.to[1] - to[1];
      } else if (to[1] < range.value.from[1]) {
         delta = range.value.from[1] - to[1];
      }
      to[1] += delta;
      from[1] += delta;

      // 确保对角方向的点位置不变
      const newCrossPos = getCrossPosition();
      const deltaPos = [
         oldCrossPos[0] - newCrossPos[0],
         oldCrossPos[1] - newCrossPos[1],
      ];
      from[0] += deltaPos[0];
      from[1] += deltaPos[1];
      to[0] += deltaPos[0];
      to[1] += deltaPos[1];

      // 更新控制点位置
      setControlPointPosition(from, to);
   }

   // 防止控制点跨越问题
   const { from, to } = selectRange.value;
   if (from[0] > to[0] || from[1] > to[1]) {
      from[0] > to[0] && (from[0] = to[0] = crossPosition[0]);
      from[1] > to[1] && (from[1] = to[1] = crossPosition[1]);
      setControlPointPosition(from, to);
   }

   // 绘制
   context.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
   drawImage(context.value, drakImage.value, {
      from: range.value.from,
      to: range.value.to,
   });
   drawParticalImage(
      context.value,
      image.value,
      range.value.from,
      range.value.to,
      selectRange.value.from,
      selectRange.value.to
   );
   !props.noSplitLines &&
      drawSplitLines(
         context.value,
         selectRange.value.from,
         selectRange.value.to,
         3,
         3,
         '#777'
      );
}

function getCrossPosition() {
   const { from, to } = selectRange.value;

   if (capturedPoint === null) {
      [from[0], from[1]];
   }

   if (capturedPoint === pointLT.value) {
      return [to[0], to[1]];
   } else if (capturedPoint === pointRB.value) {
      return [from[0], from[1]];
   } else if (capturedPoint === pointLB.value) {
      return [to[0], from[1]];
   } else {
      return [from[0], to[1]];
   }
}

function setControlPointPosition(
   _from: [number, number],
   _to: [number, number]
) {
   const from = _from.map((i) => i / devicePixelRatio);
   const to = _to.map((i) => i / devicePixelRatio);

   pointLT.value!.style.transform = `translate(${from[0]}px, ${from[1]}px)`;
   pointRT.value!.style.transform = `translate(${to[0]}px, ${from[1]}px)`;
   pointLB.value!.style.transform = `translate(${from[0]}px, ${to[1]}px)`;
   pointRB.value!.style.transform = `translate(${to[0]}px, ${to[1]}px)`;
}

// 处理控制点拖拽
let capturedPoint: HTMLDivElement | null = null;

function handleMouseDown(e: MouseEvent, which: 'lt' | 'rt' | 'lb' | 'rb') {
   e.preventDefault?.();
   if (which === 'lb') {
      capturedPoint = pointLB.value;
   } else if (which === 'lt') {
      capturedPoint = pointLT.value;
   } else if (which === 'rb') {
      capturedPoint = pointRB.value;
   } else {
      capturedPoint = pointRT.value;
   }

   window.addEventListener('mousemove', handleMouseMove);
   window.addEventListener('mouseup', handleMouseUp);
   window.addEventListener('touchmove', handleTouchMove, { passive: false });
   window.addEventListener('touchend', handleMouseUp);
}

function handleTouchMove(e: TouchEvent) {
   e.preventDefault();
   handleMouseMove(e.touches[0] as any as MouseEvent);
}

function handleMouseMove(e: MouseEvent) {
   if (!canvas.value || !capturedPoint) return;

   const { left, top } = canvas.value.getBoundingClientRect();
   let x = (e.clientX - left) * devicePixelRatio;
   let y = (e.clientY - top) * devicePixelRatio;

   if (x < range.value.from[0]) {
      x = range.value.from[0];
   } else if (x > range.value.to[0]) {
      x = range.value.to[0];
   }

   if (y < range.value.from[1]) {
      y = range.value.from[1];
   } else if (y > range.value.to[1]) {
      y = range.value.to[1];
   }

   const isTop =
      capturedPoint === pointLT.value || capturedPoint === pointRT.value;
   const isLeft =
      capturedPoint === pointLT.value || capturedPoint === pointLB.value;

   selectRange.value[`${isLeft ? 'from' : 'to'}`][0] = x;
   selectRange.value[`${isTop ? 'from' : 'to'}`][1] = y;

   const { from, to } = selectRange.value;
   setControlPointPosition(from, to);

   needRerender.value = true;
}

function handleMouseUp() {
   capturedPoint = null;
   window.removeEventListener('mousemove', handleMouseMove);
   window.removeEventListener('mouseup', handleMouseUp);
   window.removeEventListener('touchmove', handleTouchMove);
   window.removeEventListener('touchend', handleMouseUp);
}

// 处理选框拖拽移动
const onMove = ref(false);
const startMouseOffset = ref([0, 0]);

onMounted(() => {
   if (!canvas.value) return;

   window.addEventListener('mouseup', () => (onMove.value = false));
   canvas.value.addEventListener('mousemove', detectEnterSelect);
   canvas.value.addEventListener('mousemove', handleSelectMove);
   canvas.value.addEventListener('mousedown', (e) => {
      if (hovered.value) {
         const x = e.offsetX * devicePixelRatio;
         const y = e.offsetY * devicePixelRatio;

         onMove.value = true;
         startMouseOffset.value = [
            selectRange.value.from[0] - x,
            selectRange.value.from[1] - y,
         ];
      }
   });
});

function detectEnterSelect(e: MouseEvent) {
   if (!canvas.value || capturedPoint) return;

   const x = e.offsetX * devicePixelRatio;
   const y = e.offsetY * devicePixelRatio;

   const { from, to } = selectRange.value;
   hovered.value = x >= from[0] && x <= to[0] && y >= from[1] && y <= to[1];
}

function handleSelectMove(e: MouseEvent) {
   if (!canvas.value || capturedPoint || !onMove.value) return;

   const x = e.offsetX * devicePixelRatio;
   const y = e.offsetY * devicePixelRatio;

   const { from, to } = selectRange.value;
   const width = to[0] - from[0];
   const height = to[1] - from[1];

   [from[0], from[1]] = [
      x + startMouseOffset.value[0],
      y + startMouseOffset.value[1],
   ];
   from[0] < range.value.from[0] && (from[0] = range.value.from[0]);
   from[1] < range.value.from[1] && (from[1] = range.value.from[1]);

   [to[0], to[1]] = [from[0] + width, from[1] + height];

   const delta = [0, 0];
   to[0] > range.value.to[0] && (delta[0] = range.value.to[0] - to[0]);
   to[1] > range.value.to[1] && (delta[1] = range.value.to[1] - to[1]);
   [from[0], from[1]] = [from[0] + delta[0], from[1] + delta[1]];
   [to[0], to[1]] = [to[0] + delta[0], to[1] + delta[1]];

   setControlPointPosition(from, to);
   needRerender.value = true;
}
</script>

<style scoped>
.point-container {
   @apply absolute top-0 left-0 z-10;
}

.template-point {
   @apply bg-white hover:cursor-pointer size-2 -translate-x-1 -translate-y-1 rounded-sm border-[1px];
}
</style>
