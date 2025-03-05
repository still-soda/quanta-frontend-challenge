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
            class="overflow-hidden ease-out"
            :class="{
               'transition-all duration-500': enableTransition,
            }"
            :style="{ height: containerHeight + 'px' }">
            <div ref="container">
               <Transition
                  name="main"
                  mode="out-in"
                  :duration="300"
                  @enter="onEnter">
                  <KeepAlive>
                     <Content v-if="activeIndex === 0" />
                     <History v-else />
                  </KeepAlive>
               </Transition>
            </div>
         </div>
      </BaseContainer>
      <div>
         <Transition name="aside" mode="out-in" :duration="300">
            <Result v-if="activeIndex === 0" />
            <Detail v-else />
         </Transition>
      </div>
   </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { BaseContainer, SlideTabContainer, SlideTabItem } from '@/components';
import Result from './components/Result/index.vue';
import Detail from './components/Detail/index.vue';
import Content from './components/Content/index.vue';
import History from './components/History/index.vue';

const activeIndex = ref(0);

const route = useRoute();
const router = useRouter();
const id = ref(route.query.id);

onBeforeMount(() => {
   if (!id.value) {
      router.push('/error/404');
   }
});

const container = useTemplateRef<HTMLDivElement>('container');
const containerHeight = ref(0);
const enableTransition = ref(false);

onMounted(async () => {
   onEnter();
   await nextTick();
   onEnter();
   await nextTick();
   enableTransition.value = true;
});

const onEnter = () => {
   container.value &&
      (containerHeight.value = container.value.getBoundingClientRect().height);
};
</script>

<style scoped>
.main-enter-active,
.main-leave-active,
.aside-enter-active,
.aside-leave-active {
   transition:
      opacity 0.3s,
      transform 0.3s,
      filter 0.3s;
}

.main-enter-from,
.aside-enter-from,
.main-leave-to,
.aside-leave-to {
   filter: blur(0.5rem);
   transform: scale(0.95);
   opacity: 0;
}

.main-enter-to,
.aside-enter-to {
   filter: blur(0);
   transform: scale(1);
   opacity: 1;
}
</style>
