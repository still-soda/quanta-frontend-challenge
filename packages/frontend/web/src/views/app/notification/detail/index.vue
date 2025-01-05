<template>
   <div class="p-4 flex relative gap-5 h-fit">
      <BaseContainer no-header class="w-full scroll-mt-4">
         <div
            id="header"
            ref="header"
            class="relative w-full flex justify-center mt-1 items-center">
            <div
               @click="router.back()"
               class="absolute left-0 size-[2.5rem] shrink-0 rounded-[1rem] bg-green-base flex items-center justify-center text-white text-xl ml-3 hover:scale-105 active:scale-95 hover:cursor-pointer transition-transform">
               <i class="fas fa-angle-left"></i>
            </div>
            <div
               class="text-[2rem] font-bold bg-gradient-to-r from-dark-from to-dark-to text-transparent bg-clip-text w-fit max-w-[80%] text-center">
               {{ title }}
            </div>
         </div>
         <div class="flex gap-2 text-sm mx-auto text-gray-400 mt-1 mb-2">
            <div class="mx-[1.06rem] flex gap-[0.62rem] items-center">
               <i class="fas fa-clock"></i>
               2024.01.01
            </div>
            <div class="mx-[1.06rem] flex gap-[0.62rem] items-center">
               <i class="fas fa-user"></i>
               still-soda
            </div>
         </div>
         <Markdown
            :rawContent="content"
            :max-level="5"
            v-model:title="title"
            v-model:topic-tree="topic"
            class="w-full mx-auto px-[1.5rem]"
            no-title />
      </BaseContainer>
      <div>
         <BaseContainer title="大纲" class="w-[19.0625rem] sticky top-4">
            <div class="flex flex-col space-y-1 hover:[&_div]:text-orange-high">
               <a href="#header" class="text-[1rem]">{{ title }}</a>
               <a
                  v-for="(item, idx) in topic"
                  :href="`#${item.title}`"
                  :key="idx"
                  :style="{ marginLeft: `${item.level - 1}rem` }"
                  class="text-[0.875rem] hover:text-orange-high hover:cursor-pointer">
                  {{ item.title }}
               </a>
            </div>
         </BaseContainer>
         <ReturnTop
            class="bottom-[1.62rem] transition-opacity duration-300"
            :class="{
               'opacity-0 pointer-events-none': !showReturnTop,
            }" />
      </div>
   </div>
</template>

<script setup lang="ts">
import {
   inject,
   onBeforeMount,
   onMounted,
   onUnmounted,
   Ref,
   ref,
   watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { BaseContainer, Markdown, ReturnTop } from '@/components';
import { parseToPixels } from '@challenge/utils';
import { Topic } from './index.types';

import content from '@/mock/markdown.mock';

const route = useRoute();
const router = useRouter();

const id = ref(route.query.id);
const title = ref('');
const topic = ref<Topic[]>([]);

onBeforeMount(() => {
   if (!id.value) {
      router.push('/error/404');
   }

   window.scrollTo({
      top: 0,
      behavior: 'smooth',
   });
});

const header = ref<HTMLElement | null>(null);
const showReturnTop = ref(false);
const navigatorHeight = inject('navigatorHeight') as Ref<number>;

function detectHeaderHidden() {
   if (!header.value) {
      return;
   }
   const headerTop =
      header.value.getBoundingClientRect().top + parseToPixels('4rem');
   showReturnTop.value = navigatorHeight.value > headerTop;
}

onMounted(() => {
   window.addEventListener('scroll', detectHeaderHidden);
});

onUnmounted(() => {
   window.removeEventListener('scroll', detectHeaderHidden);
});

watch(topic, () => {
   const topicsId = topic.value.map((item) => `#${item.title}`);
   const observer = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            const it = document.querySelector(`a[href="#${entry.target.id}"]`);
            if (!it) {
               return;
            }
            entry.isIntersecting && it.classList.add('text-orange-high');
            !entry.isIntersecting && it.classList.remove('text-orange-high');
         });
      },
      { rootMargin: '0px', threshold: 0.5 }
   );
   topicsId.forEach((id) => {
      const target = document.querySelector(id);
      target && observer.observe(target);
   });
});
</script>
