<template>
   <div
      ref="container"
      class="relative bg-white text-dark-normal shadow-inside w-fit py-[5px] px-[11px] flex flex-row gap-2 items-center hover:cursor-pointer rounded-inside"
      :class="{
         'opacity-50': props.disabled,
         'hover:cursor-not-allowed': props.disabled,
      }"
      @click="toggleOpened">
      <slot name="content">
         {{ selectedOption?.label ?? placeholder ?? '无选项' }}
      </slot>
      <div
         class="transition-transform duration-300 ml-auto"
         :class="{
            '-rotate-180': opened,
         }">
         <slot name="icon" :opened="opened">
            <i class="fas fa-angle-down"></i>
         </slot>
      </div>

      <div
         ref="optionsContainer"
         class="absolute top-full px-[5px] shadow-xl rounded-inside mt-1 bg-white w-ful border-t-[1px] border-gray-100 min-w-full flex flex-col overflow-hidden z-40"
         style="
            transition:
               height 300ms,
               padding-block 300ms,
               opacity 0ms;
         "
         :style="{
            paddingBlock: opened ? '5px' : '0',
            height: `${
               optionsContainerHeight + (optionsContainerHeight && 10)
            }px`,
            opacity: hidden ? 0 : 1,
            pointerEvents: hidden ? 'none' : 'auto',
            left: `${xOffset}px`,
         }">
         <slot></slot>
      </div>
   </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide, ref, toRaw, toRefs, watch } from 'vue';
import Option from './Option.vue';

type OptionType = InstanceType<typeof Option>;

// 处理下拉框的逻辑
const opened = ref(false);
const container = ref<HTMLElement | null>(null);
const optionsContainer = ref<HTMLElement | null>(null);
const optionsContainerHeight = ref(0);
const hidden = ref(true);

let hideTimer: ReturnType<typeof setTimeout> | null = null;

function toggleOpened(e: MouseEvent) {
   if (
      propsRef.disabled.value ||
      !optionsContainer.value ||
      optionsContainer.value.contains(e.target as Node)
   )
      return;

   opened.value = !opened.value;
   if (opened.value) {
      openSelect();
      requestAnimationFrame(() => {
         document.addEventListener('click', closeSelect);
      });
   } else {
      closeSelect();
      document.removeEventListener('click', closeSelect);
   }
}

function openSelect() {
   if (!optionsContainer.value) return;

   if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
   }
   hidden.value = false;

   let height = 0;
   for (let i = 0; i < optionsContainer.value.children.length; i++) {
      height += (
         optionsContainer.value.children[i] as HTMLElement
      ).getBoundingClientRect().height;
   }
   optionsContainerHeight.value = height;
   opened.value = true;
}

function closeSelect() {
   document.removeEventListener('click', closeSelect);
   optionsContainerHeight.value = 0;
   opened.value = false;

   hideTimer = setTimeout(() => {
      hidden.value = true;
   }, 300);
}

// Props 和 Emits
const props = defineProps<{
   value?: string | number;
   placeholder?: string;
   disabled?: boolean;
}>();
const propsRef = toRefs(props);

const emits = defineEmits(['update:value']);

// 选中的选项以及初始化
const selectedOption = ref<OptionType | null>(null);
onMounted(() => {
   if (props.value) {
      const option = options.value.find((i) => i.value === props.value);
      if (option) {
         selectedOption.value = option;
         option.selected = true;
      }
   }
});

// 注册选项
const options = ref<OptionType[]>([]);

provide('registerOption', registerOption);
function registerOption(option: OptionType) {
   options.value.push(option);
   nextTick(() => {
      calcXOffset();
   });
}

provide('cancelOption', cancelOption);
function cancelOption(option: OptionType) {
   const index = options.value.findIndex((i) => i === option);
   if (index !== -1) {
      options.value.splice(index, 1);
   }
   nextTick(() => {
      calcXOffset();
   });
}

provide('selectOption', selectOption);
function selectOption(option: OptionType) {
   selectedOption.value = option;
   options.value.forEach((i) => {
      i.selected = toRaw(i) === option;
   });
   const rawOption: any = toRaw(option.value);
   emits('update:value', rawOption.value);
   nextTick(() => {
      calcXOffset();
   });
}

// 计算选项容器 x 轴偏移量
const xOffset = ref(0);

onMounted(calcXOffset);

function calcXOffset() {
   if (!container.value || !optionsContainer.value) return;

   const containerWidth = container.value.getBoundingClientRect().width;
   const optionsContainerWidth =
      optionsContainer.value.getBoundingClientRect().width;

   xOffset.value = (containerWidth - optionsContainerWidth) / 2;
}

// 监听禁用
watch(
   () => props.disabled,
   (disabled) => disabled && closeSelect()
);
</script>
