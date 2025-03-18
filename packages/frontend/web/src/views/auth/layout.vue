<template>
   <div
      class="min-w-[50rem] w-screen h-screen flex items-center justify-center bg-[#F5F7FB]">
      <div
         style="view-transition-name: container"
         class="rounded-outside h-fit shadow-outside bg-white p-[0.5rem] flex gap-[2.625rem] pr-[2.625rem] items-center relative">
         <!-- LEFT -->
         <div
            class="relative shrink-0 bg-white overflow-hidden rounded-inside h-full flex">
            <div
               style="view-transition-name: cover"
               class="pt-[3.1875rem] z-50 flex h-full flex-col shrink-0 items-center gap-[0.625rem] relative my-auto">
               <h2 class="text-[1.25rem] font-semibold text-orange-high">
                  Quanta前端挑战
               </h2>
               <img
                  class="h-[21.625rem] w-[24.25rem] z-50"
                  src="@/assets/imgs/auth-cover.png"
                  alt="欢迎来到Quanta前端挑战" />
            </div>
         </div>
         <!-- RIGHT -->
         <div
            style="view-transition-name: form"
            class="flex flex-col gap-[1.5625rem] w-[18.5625rem] shrink-0 z-10 relative">
            <RouterView />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const removeGuard = router.beforeResolve((_, __, next) => {
   if (document.startViewTransition) {
      document.startViewTransition(() => {
         next();
      });
      return;
   }
   next();
});

onUnmounted(() => {
   removeGuard();
});
</script>

<style lang="css">
::view-transition-group(:not(root)) {
   animation-duration: 0.3s;
   animation-timing-function: ease-in-out;
}
</style>
