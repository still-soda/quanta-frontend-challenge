<template>
   <div class="p-4 flex gap-4">
      <BaseContainer no-header class="w-full h-full relative">
         <SlideTabContainer
            class="w-fit text-[0.875rem] text-nowrap"
            v-model:active-index="activeIndex">
            <SlideTabItem v-slot="{ active }">
               <div
                  class="py-[0.31rem] px-[0.62rem] transition-colors"
                  :class="{
                     'text-white': active,
                     'text-dark-normal': !active,
                  }">
                  题目详情
               </div>
            </SlideTabItem>
            <SlideTabItem v-slot="{ active }">
               <div
                  class="py-[0.31rem] px-[0.62rem] transition-colors"
                  :class="{
                     'text-white': active,
                     'text-dark-normal': !active,
                  }">
                  历史作答
               </div>
            </SlideTabItem>
         </SlideTabContainer>
         <div
            class="overflow-hidden ease-out mt-1"
            :class="{
               'transition-all duration-500': enableTransition,
            }"
            :style="{ height: containerHeight + 'px' }">
            <div ref="container">
               <Transition
                  name="main"
                  mode="out-in"
                  :duration="300"
                  @enter="resizeContainer">
                  <KeepAlive>
                     <Content v-if="activeIndex === 0" />
                     <History v-else />
                  </KeepAlive>
               </Transition>
            </div>
         </div>
      </BaseContainer>
      <div>
         <div class="sticky top-4">
            <Result />
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
import {
   nextTick,
   onBeforeMount,
   onMounted,
   onUnmounted,
   ref,
   useTemplateRef,
   watchEffect,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { BaseContainer, SlideTabContainer, SlideTabItem } from '@/components';
import Result from './components/Result/index.vue';
import Content from './components/Content/index.vue';
import History from './components/History/index.vue';

const route = useRoute();
const router = useRouter();

const id = ref(route.query.id);
const activeIndex = ref(route.query.tab === '1' ? 1 : 0);

watchEffect(() => {
   router.replace({
      query: {
         id: id.value,
         tab: activeIndex.value === 1 ? '1' : '0',
      },
   });
});

// 检查 id 是否存在，不存在则跳转到 404 页面
onBeforeMount(() => {
   if (!id.value) {
      router.push('/error/404');
   }
});

const container = useTemplateRef<HTMLDivElement>('container');
const containerHeight = ref(0);
const enableTransition = ref(false);

// 进入页面时候回到顶部，并且无动画调整高度
onMounted(async () => {
   resizeContainer();
   await nextTick();
   resizeContainer();
   await nextTick();
   scrollTo(0, 0);
   enableTransition.value = true;
});

const resizeContainer = () => {
   container.value &&
      (containerHeight.value = container.value.getBoundingClientRect().height);
};

// 监视容器变化，自动调整高度
let observer: ResizeObserver;

onMounted(() => {
   if (!container.value) return;
   observer = new ResizeObserver(() => {
      resizeContainer();
   });
   observer.observe(container.value!);
});

onUnmounted(() => {
   observer.disconnect();
});
</script>

<style scoped>
.main-enter-active,
.main-leave-active {
   transition:
      opacity 0.3s,
      transform 0.3s,
      filter 0.3s;
}

.main-enter-from,
.main-leave-to {
   filter: blur(0.5rem);
   transform: scale(0.95);
   opacity: 0;
}

.main-enter-to {
   filter: blur(0);
   transform: scale(1);
   opacity: 1;
}
</style>
