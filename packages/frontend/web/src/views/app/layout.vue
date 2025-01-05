<template>
   <div
      class="w-full bg-background min-w-[1184px] flex justify-center h-screen min-h-[840px]">
      <!-- 侧边栏 -->
      <aside
         class="fixed h-screen left-0 w-[5.0625rem] bg-dark-sidebar flex items-center py-4 flex-col z-50">
         <div class="size-[3.4375rem] shrink-0 rounded-full overflow-hidden">
            <img src="../../assets/imgs/quanta-logo.jpg" alt="logo" />
         </div>
         <SlideTabContainer
            vertical
            :gap="20"
            v-model:active-index="activeIndex"
            class="border-none w-fit mt-6 shadow-none">
            <SlideTabItem v-for="(tab, idx) in aboveTabs" :key="idx">
               <RouterLink
                  class="size-[2.8125rem] flex items-center justify-center transition-colors"
                  :to="tab.to"
                  :class="{
                     'text-white': activeIndex !== idx,
                     'text-dark-normal': activeIndex === idx,
                  }">
                  <Component :is="tab.icon" />
               </RouterLink>
            </SlideTabItem>
         </SlideTabContainer>
         <footer class="mt-auto flex flex-col gap-5">
            <div
               v-for="(tab, idx) in underTabs"
               :key="idx"
               @click="handleUnderTabClick(idx)"
               class="text-white hover:text-orange-high transition-colors hover:cursor-pointer">
               <Component :is="tab.icon" />
            </div>
         </footer>
      </aside>
      <!-- 右侧区域 -->
      <main class="ml-[5.0625rem] flex flex-col w-full h-full items-center">
         <div class="flex flex-col max-w-[1400px] w-full">
            <div ref="navigatorContainer">
               <Navigator />
            </div>
            <RouterView v-slot="{ Component }">
               <Transition name="page" mode="out-in" :duration="400" appear>
                  <Component :is="Component" />
               </Transition>
            </RouterView>
         </div>
      </main>
   </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { SlideTabContainer, SlideTabItem, Icon } from '@/components';
import Navigator from './components/Navigator.vue';

import { onMounted, provide, ref, watch } from 'vue';

const route = useRoute();

// 侧边栏上方的图标
const aboveTabs = [
   { icon: Icon.Home, todo: () => {}, to: '/dashboard' },
   { icon: Icon.Rank, todo: () => {}, to: '/rank' },
   { icon: Icon.Code, todo: () => {}, to: '/challenge' },
   { icon: Icon.Info, todo: () => {}, to: '/notification' },
];
// 侧边栏下方的图标
const underTabs = [
   { icon: Icon.Option, todo: () => {}, to: '/option' },
   { icon: Icon.Sun, todo: () => {} },
];

const activeIndex = ref(0);

watch(
   route,
   (to) => {
      const idx = aboveTabs.findIndex((tab) => to.path.includes(tab.to));
      if (idx !== -1) {
         activeIndex.value = idx;
      }
   },
   { immediate: true }
);

watch(activeIndex, (val) => {
   console.log(`[above]: goto ${val}`);
   aboveTabs[val].todo();
});

function handleUnderTabClick(idx: number) {
   console.log(`[under]: goto ${idx}`);
   underTabs[idx].todo();
}

// 获取并向子组件提供 navigator 高度
const navigatorContainer = ref<HTMLElement | null>(null);
const navigatorHeight = ref(0);
provide('navigatorHeight', navigatorHeight);

onMounted(() => {
   if (navigatorContainer.value) {
      navigatorHeight.value =
         navigatorContainer.value.getBoundingClientRect().height;
   } else {
      console.error('navigatorContainer is null');
   }
});
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
   transition: opacity 0.5s, transform 0.5s, filter 0.3s;
}

.page-enter-from,
.page-leave-to {
   opacity: 0;
   filter: blur(10px);
   transform: translateY(1.25rem);
}

.page-enter-to,
.page-leave-from {
   opacity: 1;
   filter: blur(0);
   transform: translateY(0);
}
</style>
