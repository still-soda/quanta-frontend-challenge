<template>
   <div class="p-4">
      <BaseContainer>
         <template #title>
            <div
               class="text-[1.5rem] font-bold bg-gradient-to-r from-dark-from to-dark-to w-fit bg-clip-text text-transparent">
               公告栏
            </div>
         </template>
         <div class="flex flex-col gap-[1.12rem] my-[1.12rem]">
            <Post
               v-for="idx in 10"
               title="庆祝"
               description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi,
                    dolores placeat! Nam vero a molestiae fuga quas saepe distinctio vel
                    tempora incidunt, itaque non repellat voluptas modi voluptate quis
                    quod. Lorem ipsum dolor sit amet"
               date="2024.01.01"
               author="still-soda"
               :link="`/notification/detail?id=${idx}`"
               image-url="https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg" />
         </div>
      </BaseContainer>
   </div>
</template>

<script setup lang="ts">
import { BaseContainer } from '@/components';
import Post from './components/Post.vue';
</script>
