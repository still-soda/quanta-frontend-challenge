<template>
   <div class="flex flex-col">
      <svg
         ref="logo"
         width="186"
         height="107"
         viewBox="0 0 186 107"
         fill="none"
         class="drop-shadow-lg shadow-dark-normal w-20"
         xmlns="http://www.w3.org/2000/svg">
         <path
            d="M84.5 37.5L79 11L11 24L24.5 96L48 92"
            stroke="#FE6603"
            stroke-width="22"
            stroke-linecap="round"
            stroke-linejoin="round" />
         <path
            d="M64.5 62.5L95.5 86.5"
            stroke="#FE6603"
            stroke-width="22"
            stroke-linecap="round" />
         <path
            d="M114 24L117.5 23"
            stroke="white"
            stroke-width="22"
            stroke-linecap="round" />
         <path
            d="M175 12L145.5 17.5L156 75"
            stroke="white"
            stroke-width="22"
            stroke-linecap="round"
            stroke-linejoin="round" />
      </svg>
      <div class="-mt-4 text-white font-medium">加载中...</div>
   </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const logo = ref<SVGElement | null>(null);
const timers = ref<ReturnType<typeof setInterval>[]>([]);

onMounted(() => {
   if (!logo.value) {
      return;
   }
   const paths = logo.value.querySelectorAll('path');
   paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length - 1}`;
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 1.5s ease';

      let current = length - 1;
      const update = () => {
         current = current === length - 1 ? 1 - length : length - 1;
         path.style.strokeDashoffset = `${current}`;
      };
      update();

      const timer = setInterval(update, 1000);
      timers.value.push(timer);
   });
});

onUnmounted(() => {
   timers.value.forEach(clearInterval);
});
</script>
