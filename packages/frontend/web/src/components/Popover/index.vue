<template>
   <div ref="bindItemContainer" class="relative h-fit">
      <slot></slot>
      <div
         ref="popover"
         class="p-2 rounded-md shadow-lg absolute z-10 bg-dark-normal text-white pointer-events-none w-fit"
         :style="{
            top: !onBottom ? `${-popHeight - (yOffset ?? 5)}px` : undefined,
            bottom: onBottom ? `${-popHeight - (yOffset ?? 5)}px` : undefined,
            transform: translateXY,
         }"
         :class="{
            'opacity-0': !showPopover,
            'opacity-100': showPopover,
            'ease-in-out': !showPopover,
            'ease-bounce': showPopover,
            'duration-100': !showPopover,
            'duration-300': showPopover,
         }">
         <slot name="content">使用 #content 插槽自定义内容</slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';

const bindItemContainer = ref<HTMLDivElement | null>(null);
const popover = ref<HTMLDivElement | null>(null);
const showPopover = ref(false);
const onBottom = ref(false);
const popHeight = ref(0);
const offset = reactive({ x: 0, y: 0 });

const {
   position = 'ct',
   xOffset = 0,
   closeOffsetY = 15,
} = defineProps<{
   position?: 'lt' | 'lb' | 'ct' | 'cb' | 'rt' | 'rb';
   yOffset?: number;
   xOffset?: number;
   closeOffsetY?: number;
}>();

const translateXY = computed(() => {
   const yOffset =
      !onBottom.value && position.includes('t') ? closeOffsetY : -closeOffsetY;
   const x = offset.x;
   const y = offset.y + (showPopover.value ? 0 : yOffset);
   return `translate(${x}px, ${y}px)`;
});

onMounted(() => {
   if (!bindItemContainer.value || !popover.value) return;
   const bindItem = bindItemContainer.value.children[0] as HTMLElement;

   updatePopoverPos();
   function updatePopoverPos() {
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
      const { top, bottom, left, width } = bindItem.getBoundingClientRect();
      const { height: popHeight, width: popWidth } =
         popover.value!.getBoundingClientRect();

      // 调整 x 轴位置
      const xAtLeft = position.includes('l');
      const xAtCenter = !xAtLeft && position.includes('c');

      let offsetX;
      if (xAtCenter) {
         offsetX = -(popWidth - width) / 2;
      } else if (xAtLeft) {
         offsetX = 0;
      } else {
         offsetX = -(popWidth - width);
      }
      offsetX += xOffset ?? 0;

      const shiftedLeft = offsetX + left;
      if (shiftedLeft < 0) {
         offsetX -= shiftedLeft;
      } else if (windowWidth - shiftedLeft < popWidth) {
         offsetX -= popWidth - windowWidth + shiftedLeft;
      }

      offset.x = offsetX;

      // 调整 y 轴位置
      const yAtTop = position.includes('t');
      if (yAtTop) {
         onBottom.value = top <= popHeight;
      } else {
         onBottom.value = bottom < windowHeight;
      }
   }

   // 根据当前组件的位置自动调整popover的位置，尽量避免离开视口
   bindItem.addEventListener('mouseenter', () => {
      updatePopoverPos();

      // 设为可见
      showPopover.value = true;
   });
   bindItem.addEventListener('mouseleave', () => {
      // 设为不可见
      showPopover.value = false;
   });

   // 更新popover的高度
   updatePopHeight();
   function updatePopHeight() {
      const { height } = popover.value!.getBoundingClientRect();
      popHeight.value = height;
   }
   popover.value.addEventListener('resize', () => {
      updatePopHeight();
   });
});
</script>

<style scoped></style>
