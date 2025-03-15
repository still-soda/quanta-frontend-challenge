<template>
   <div class="flex gap-4 text-dark-normal">
      <aside class="shrink-0">
         <img
            class="w-10 h-10 rounded-full shrink-0"
            :src="publisher.avatar"
            alt="头像" />
      </aside>
      <main class="w-full flex flex-col gap-3">
         <header
            class="flex gap-x-4 gap-y-2 items-center w-full text-sm text-nowrap flex-wrap overflow-ellipsis">
            <!-- Date -->
            <div class="tracking-wide h-fit">
               <slot name="date" :date="date">
                  {{ date }}
               </slot>
            </div>
            <!-- Topic -->
            <div class="flex gap-2 mr-auto font-medium text-sm">
               <slot
                  name="topic"
                  :publisher="publisher.username"
                  :language="language">
                  <span class="tracking-wide">{{ publisher.username }}</span>
                  <span class="flex gap-2">
                     发布了一条{{ isNew ? '新的' : '' }}
                     <span
                        class="font-semibold tracking-wide"
                        :style="{
                           color: TAG_COLOR_MAPPING[language!] ?? 'gray',
                        }">
                        {{ TAG_TEXT_MAPPING[language!] ?? language }}
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
import { svgToBase64 } from '@/adapters/svgToBase64.adapters';
import { getDefaultAvatar, getUserById } from '@/apis/user.api';
import { Tag, useMessage } from '@/components';
import { TagType } from '@/components/Tag/index.types';
import { DEFAULT_AVATAR } from '@/constant/default.constant';
import { TAG_COLOR_MAPPING, TAG_TEXT_MAPPING } from '@/constant/tags.constant';
import { User } from '@/models/user.model';
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

const message = useMessage();

const props = defineProps<{
   link?: string;
   date?: string;
   topic?: string;
   isNew?: boolean;
   publisherId?: string;
   language?: string;
   tags?: { [type: string]: string };
}>();

const newTags = props.isNew ? { danger: '最新挑战' } : {};

// 更新发布者信息
const publisher = ref<User>({
   avatar: DEFAULT_AVATAR,
   username: '---',
} as User);
watch(
   () => props.publisherId,
   async (id) => {
      if (!id) return;

      try {
         publisher.value = (await getUserById(id)).data;
         if (!publisher.value.avatar) {
            const {
               data: { avatar },
            } = await getDefaultAvatar(publisher.value.id);
            publisher.value.avatar = svgToBase64(avatar);
         }
      } catch (error: any) {
         message.error(error.message, { duration: 3000 });
      }
   },
   { immediate: true }
);
</script>
