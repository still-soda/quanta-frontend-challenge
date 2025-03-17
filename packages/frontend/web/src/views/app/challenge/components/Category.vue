<template>
   <div class="flex gap-[0.94rem] items-center">
      <CategoryTag
         @click="selectTag('all')"
         :class="{
            'bg-dark-normal text-white': props.selected.length === 0,
            'bg-white text-dark-normal': props.selected.length !== 0,
         }">
         全部
      </CategoryTag>
      <CategoryTag
         v-for="tag in tags"
         @click="selectTag(tag._id)"
         :class="{
            '!bg-white text-dark-normal': !props.selected.includes(tag._id),
            'text-white': props.selected.includes(tag._id),
         }"
         :style="{
            backgroundColor: props.selected.includes(tag._id) && tag.color,
         }"
         :key="tag._id">
         <div class="flex items-center gap-2 font-medium">
            <img :src="tag.icon" :alt="tag.name" class="size-5" />
            {{ tag.name }}
         </div>
      </CategoryTag>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CategoryTag from './CategoryTag.vue';
import { Tag } from '@/models/tag.model';
import { useMessage } from '@/components';
import { getAllTags } from '@/apis/tags.api';

const message = useMessage();
const SERVER_URL = import.meta.env.VITE_APP_API_BASE_URL as string;

const props = defineProps<{ selected: string[] }>();
const emits = defineEmits(['update:selected']);

// 标签列表
const tags = ref<Tag[]>([]);

// 更新标签
updateTags();
async function updateTags() {
   try {
      const result = await getAllTags();
      tags.value = result.data.map((tag: Tag) => {
         tag.icon = `${SERVER_URL}${tag.icon}`;
         return tag;
      });
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   }
}

// 选择标签
function selectTag(id: string) {
   if (id === 'all') {
      emits('update:selected', []);
      return;
   }

   const index = props.selected.indexOf(id);
   if (index === -1) {
      emits('update:selected', [...props.selected, id]);
   } else {
      const selected = props.selected.filter((item) => item !== id);
      emits('update:selected', selected);
   }
}
</script>
