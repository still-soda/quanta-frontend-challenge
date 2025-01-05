<template>
   <div
      class="m-[1rem] mb-0 px-6 h-[3.875rem] flex items-center rounded-outside shadow-outside text-dark-normal bg-white">
      <div class="flex gap-[0.44rem] font-medium text-[1.25rem]">
         <span class="text-orange-high font-semibold">Quanta</span>
         前端挑战
      </div>
      <!-- Tabs -->
      <div class="ml-[4.5rem] flex gap-5 text-base">
         <RouterLink
            v-for="(tab, idx) in tabs"
            :key="idx"
            :to="tab.path"
            class="hover:text-orange-high transition-colors hover:cursor-pointer w-[5rem]"
            :class="{
               'text-orange-high': route.fullPath.includes(tab.path),
            }">
            {{ tab.name }}
         </RouterLink>
      </div>
      <!-- User -->
      <RouterLink
         class="ml-auto hover:cursor-pointer hover:text-orange-high transition-colors"
         to="/profile">
         <div class="flex items-center gap-[0.8rem] font-normal text-lg">
            <span>你好，{{ userStore.name }}</span>
            <img
               class="size-[2.25rem] shrink-0 rounded-full"
               :src="userStore.avatar"
               alt="avatar" />
         </div>
      </RouterLink>
   </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user.store';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

const userStore = useUserStore();

const tabs = [
   { name: '仪表盘', path: '/dashboard' },
   { name: '全部排名', path: '/rank' },
   { name: '全部挑战', path: '/challenge' },
   { name: '公告栏', path: '/notification' },
];
</script>
