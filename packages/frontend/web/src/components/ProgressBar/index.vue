<template>
   <div class="relative w-full h-2 rounded-2xl bg-gray-200 overflow-hidden">
      <div
         class="h-full left-0 bg-green-base rounded-2xl"
         style="transition: width 1s ease-out"
         :style="{
            width: `${displayPercent * 100}%`,
         }"></div>
   </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
   percent: number;
}>();

const displayPercent = ref(0);

onMounted(() => {
   displayPercent.value = props.percent;
});

watch(
   () => props.percent,
   (newPercent) => {
      displayPercent.value = newPercent;
   }
);
</script>
