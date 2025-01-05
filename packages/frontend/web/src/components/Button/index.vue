<template>
   <div
      class="w-fit px-3 py-1 rounded-inside border-solid transition-all select-none"
      @click="!disabled && emitter('click')"
      :class="{
         // enable
         ' cursor-pointer hover:opacity-90 hover:scale-105 active:scale-100':
            !disabled,
         // disable
         'cursor-not-allowed opacity-50': disabled,

         // primary
         'bg-[#FF9232] border-[#FF9232] text-white':
            !disabled && type === 'primary',
         // secondary
         'bg-transparent border-[#FF9232] text-[#FF9232]':
            !disabled && type === 'secondary',
         // link
         'bg-transparent ring-0 text-dark-normal hover:text-[#FF9232] border-none':
            !disabled && type === 'link',
         // danger
         'bg-red-base border-red-base text-white':
            !disabled && type === 'danger',
      }">
      <slot></slot>
   </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ButtonTypes } from './index.types';

defineProps({
   type: {
      type: String as PropType<ButtonTypes>,
      default: 'primary',
   },
   disabled: {
      type: Boolean,
      default: false,
   },
});

const emitter = defineEmits(['click']);
</script>
