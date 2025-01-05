<template>
   <div
      class="relative p-[5px] rounded-[14px] shadow-inside border-t bottom-2 border-t-gray-100">
      <div
         ref="indicator"
         class="absolute bg-orange-high transition-all rounded-outside top-2 z-0"
         :style="{
            width: `${indicatorWidth}px`,
            height: `${indicatorHeight}px`,
            left: `${indicatorLeft + 5}px`,
            top: `${indicatorTop + 5}px`,
         }"></div>
      <div
         ref="container"
         class="relative flex z-10 h-full"
         :style="{
            gap: `${props.gap}px`,
         }"
         :class="{
            'flex-col': props.vertical,
            'flex-row': !props.vertical,
         }">
         <slot></slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref, watch } from 'vue';
import { SlideTabItem } from '..';

const props = defineProps<{
   activeIndex?: number;
   vertical?: boolean;
   gap?: number;
}>();

const emits = defineEmits(['update:activeIndex', 'change']);

const container = ref<HTMLElement | null>(null);
const ceils = ref<InstanceType<typeof SlideTabItem>[]>([]);
const indicator = ref<HTMLElement | null>(null);
const indicatorWidth = ref(0);
const indicatorHeight = ref(0);
const indicatorLeft = ref(0);
const indicatorTop = ref(0);
const currentActiveIndex = ref(props.activeIndex ?? 0);

provide('registerCeil', registerCeil);
function registerCeil(ceil: InstanceType<typeof SlideTabItem>) {
   ceils.value.push(ceil);
}

provide('toggleActive', toggleActive);
function toggleActive(index: number) {
   for (let i = 0; i < ceils.value.length; i++) {
      ceils.value[i].active = i === index;
   }
   emits('update:activeIndex', index);
   emits('change', index);
   moveIndicator(index);
   currentActiveIndex.value = index;
}

function moveIndicator(index: number) {
   if (!indicator.value || !container.value) {
      return;
   }
   const ceils = container.value.children;
   const ceil = ceils[index] as HTMLElement;
   const { left, top, width, height } = ceil.getBoundingClientRect();
   const startLeft = ceils[0].getBoundingClientRect().left;
   const startTop = ceils[0].getBoundingClientRect().top;
   indicatorWidth.value = width;
   indicatorHeight.value = height;
   indicatorLeft.value = left - startLeft;
   indicatorTop.value = top - startTop;
}

onMounted(() => {
   if (!container.value) {
      return;
   }

   ceils.value.forEach((ceil, index) => {
      ceil.active = index === props.activeIndex;
      ceil.index = index;
   });

   moveIndicator(props.activeIndex ?? 0);

   container.value.addEventListener('resize', () => {
      moveIndicator(currentActiveIndex.value);
   });
});

watch(
   () => props.activeIndex,
   (val) => {
      toggleActive(val!);
   },
   { immediate: true }
);
</script>
