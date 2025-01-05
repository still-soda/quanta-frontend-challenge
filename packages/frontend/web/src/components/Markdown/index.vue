<template>
   <div ref="page"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { parse, lexer, Renderer } from 'marked';
import { Topic } from './index.types';

const page = ref<HTMLDivElement | null>(null);

const props = defineProps<{
   rawContent: string;
   topicTree?: Topic[];
   maxLevel?: number;
   title?: string;
   noTitle?: boolean;
}>();

const emits = defineEmits(['update:topicTree', 'update:title']);

async function parseContent() {
   if (!page.value) {
      return;
   }

   // 解析 markdown
   const safeContent = props.rawContent.replace(
      /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
      ''
   );
   const html = await parse(safeContent);
   const dom = new DOMParser().parseFromString(html, 'text/html');

   dom.querySelectorAll('*').forEach((node) => {
      node.setAttribute('data-markdown', '');
   });
   props.noTitle &&
      dom.querySelector('h1')?.style.setProperty('display', 'none');

   page.value.innerHTML = dom.body.innerHTML;

   // 生成目录树
   const tokens = lexer(safeContent);
   const maxLevel = props.maxLevel || 2;

   const topics = tokens
      .filter((token) => {
         return token.type === 'heading' && token.depth <= maxLevel;
      })
      .map((token: any) => {
         return {
            level: token.depth,
            title: token.text,
            id: token.text.toLowerCase().replace(/\s/g, '-'),
         };
      });
   topics.shift();

   // 更新目录树
   emits('update:topicTree', topics);

   // 更新标题
   const title = dom.querySelector('h1')?.textContent;
   emits('update:title', title || '');
}

onMounted(() => {
   const renderer: Renderer = new Renderer();
   renderer.image = ({ href, title, text }) => {
      return `
        <div class="flex flex-col text-center gap-2">
            <img class="mb-0" src="${href}" alt="${text}" title="${title}" />
            <div class="mt-0 text-gray-400 text-sm">${text}</div>
        </div>
      `;
   };
   renderer.heading = ({ text, depth }) => {
      return `<h${depth} id="${text}">${text}</h${depth}>`;
   };
   parse.setOptions({ renderer });

   parseContent();
});

watch(
   () => props.rawContent,
   () => {
      parseContent();
   }
);
</script>

<style>
@import url(./default.theme.css);
</style>
