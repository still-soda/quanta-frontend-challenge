<template>
   <div
      @click="handleClick"
      class="transition-colors py-1 px-2 rounded-inside"
      :class="{
         'opacity-50': selected,
         'cursor-not-allowed': selected,
         'hover:bg-gray-100': !selected,
      }">
      <slot>
         <span class="text-nowrap">{{ label }}</span>
      </slot>
   </div>
</template>

<script setup lang="ts">
import { inject, Ref, ref, toRefs } from 'vue';

interface OptionType {
   selected: Ref<boolean>;
   value: Ref<string | number>;
   label: Ref<string>;
}
const selected = ref(false);

// Props 和 Emits
const props = defineProps<{
   value: string | number;
   label: string;
}>();
const propsRef = toRefs(props);

defineExpose({ selected, ...propsRef });

// 注册和选中
const registerOption = inject('registerOption') as (option: OptionType) => void;
const selectOption = inject('selectOption') as (option: OptionType) => void;

if (!registerOption || !selectOption) {
   throw new Error('Option 组件必须在 Select 组件内部使用');
}

const option: OptionType = { selected, ...propsRef };

registerOption(option);

// 点击事件
function handleClick() {
   selectOption(option);
}
</script>
