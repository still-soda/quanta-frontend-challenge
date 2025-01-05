<template>
   <div
      class="flex items-center justify-center relative"
      :style="{
         width: typeof width === 'number' ? `${width}px` : width,
         height: typeof height === 'number' ? `${height}px` : height,
      }">
      <svg :width="width" :height="height" class="absolute">
         <circle
            :cx="widthNumber / 2"
            :cy="heightNumber / 2"
            :r="widthNumber / 2 - thicknessNumber"
            :stroke-width="thickness"
            fill="none"
            stroke="#D9D9D9"
            class="absolute" />
         <circle
            :cx="widthNumber / 2"
            :cy="heightNumber / 2"
            :r="widthNumber / 2 - thicknessNumber"
            :stroke-width="thickness"
            fill="none"
            stroke="#FF9232"
            stroke-linecap="round"
            :transform="`rotate(-90 ${widthNumber / 2} ${heightNumber / 2})`"
            :stroke-dasharray="dashArray"
            class="absolute"
            style="transition: stroke-dasharray 1s" />
      </svg>
      <div class="flex flex-col gap-1 items-center text-2xl font-bold mt-2">
         <slot
            name="icon"
            :percent="percentage"
            :displayPercent="displayPercent"></slot>
         <slot
            name="text"
            :percent="percentage"
            :displayPercent="displayPercent"
            v-if="!noText">
            <div class="text-red-base">
               {{ (displayPercent * 100).toFixed(toFixed) }} %
            </div>
         </slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { parseToPixels } from '@challenge/utils';
import {
   computed,
   nextTick,
   onMounted,
   ref,
   watch,
   PropType,
   onUnmounted,
} from 'vue';

const props = defineProps({
   width: {
      type: [Number, String],
      default: 200,
   },
   height: {
      type: [Number, String],
      default: 200,
   },
   thickness: {
      type: [Number, String],
      default: 15,
   },
   percent: {
      type: Number,
      default: 0.35,
   },
   noText: {
      type: Boolean,
      default: false,
   },
   transitionDuration: {
      type: Number,
      default: 1000,
   },
   timeEaseFunction: {
      type: Function as PropType<(t: number) => number>,
      default: (x: number) => {
         return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      },
   },
   toFixed: {
      type: Number,
      default: 0,
   },
});

const percentage = ref(0);
const displayPercent = ref(0);
const updateFlag = ref(true);
let startTransitionTime = 0;
let startTransitionPercent = 0;

function updatePercentage() {
   updateFlag.value && requestAnimationFrame(updatePercentage);
   const currentTime = Date.now();
   const p = Math.min(
      1,
      (currentTime - startTransitionTime) / props.transitionDuration
   );
   if (Math.abs(displayPercent.value - percentage.value) < 0.01) {
      displayPercent.value = percentage.value;
   } else {
      displayPercent.value =
         startTransitionPercent +
         (percentage.value - startTransitionPercent) *
            props.timeEaseFunction(p);
   }
}

onMounted(() => {
   nextTick(() => {
      percentage.value = props.percent;
   });
   requestAnimationFrame(updatePercentage);
});

onUnmounted(() => {
   updateFlag.value = false;
});

watch(
   () => props.percent,
   (newPercent) => {
      percentage.value = newPercent;
   }
);

watch(
   () => props.percent,
   () => {
      startTransitionTime = Date.now();
      startTransitionPercent = displayPercent.value;
   },
   { immediate: true }
);

const asNumber = (value: number | string) => {
   return typeof value === 'number' ? value : parseToPixels(value);
};

const widthNumber = computed(() => asNumber(props.width));
const heightNumber = computed(() => asNumber(props.height));
const thicknessNumber = computed(() => asNumber(props.thickness));

const dashArray = computed(() => {
   const r = asNumber(props.width) / 2 - asNumber(props.thickness);
   const angle = percentage.value * 2 * Math.PI;
   const circumference = 2 * Math.PI * r;
   const arcLength = angle * r;
   return `${arcLength} ${circumference}`;
});
</script>
