<template>
   <div class="flex gap-4 text-dark-normal">
      <aside class="shrink-0">
         <img
            class="w-10 h-10 rounded-full shrink-0"
            src="https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg"
            alt="头像" />
      </aside>
      <main class="w-full flex flex-col gap-3">
         <header
            class="flex gap-x-6 gap-y-2 items-center w-full text-sm text-nowrap flex-wrap overflow-ellipsis">
            <!-- Date -->
            <div class="tracking-wide h-fit">
               <slot name="date" :date="date">
                  {{ date }}
               </slot>
            </div>
            <!-- Topic -->
            <div class="flex gap-2 mr-auto font-medium text-sm">
               <slot name="topic" :publisher="publisher" :language="language">
                  <span class="tracking-wide">{{ publisher }}</span>
                  <span class="flex gap-2">
                     发布了一条{{ isNew ? '新的' : '' }}
                     <span class="font-semibold text-orange-high tracking-wide">
                        {{ language }}
                     </span>
                     挑战
                  </span>
               </slot>
            </div>
            <!-- Tags -->
            <div class="flex gap-2 w-fit">
               <slot name="tags" :tags="tags">
                  <Tag
                     v-for="([type, content], idx) in Object.entries(
                        tags ? Object.assign(tags, newTags) : newTags
                     )"
                     :key="idx"
                     :type="type as TagType">
                     {{ content }}
                  </Tag>
               </slot>
            </div>
         </header>
         <Component
            :is="link ? RouterLink : 'div'"
            :to="link"
            class="rounded-outside rounded-tl-none shadow-inside py-[0.88rem] px-[0.81rem]">
            <p class="text-sm text-gray-500">
               <slot> 今天的挑战是什么呢？快来看看吧！ </slot>
            </p>
         </Component>
      </main>
   </div>
</template>

<script setup lang="ts">
import { Tag } from '@/components';
import { TagType } from '@/components/Tag/index.types';
import { RouterLink } from 'vue-router';

const props = defineProps<{
   link?: string;
   date?: string;
   topic?: string;
   isNew?: boolean;
   publisher?: string;
   language?: string;
   tags?: { [type: string]: string };
}>();

const newTags = props.isNew ? { danger: '最新挑战' } : {};
</script>

<style scoped></style>
