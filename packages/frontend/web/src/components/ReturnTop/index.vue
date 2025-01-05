<template>
   <div
      class="size-[3.625rem] shrink-0 fixed flex items-center justify-center bg-orange-high rounded-full shadow-inside text-white active:scale-95 transition-transform"
      :class="{
         'hover:cursor-pointer': enable,
         'hover:cursor-not-allowed': !enable,
      }"
      @click="returnTop">
      <Rocket />
   </div>
</template>

<script setup lang="ts">
import { Rocket } from '@/components/Icons';

const props = defineProps({
   enable: {
      type: Boolean,
      default: true,
   },
});

function returnTop() {
   if (!props.enable) return;
   window.scrollTo({
      top: 0,
      behavior: 'smooth',
   });
}
</script>
