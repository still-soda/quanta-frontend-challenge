<template>
   <RouterLink
      :to="link ?? ''"
      class="flex gap-[1.25rem] text-dark-normal bg-white p-[0.9375rem] rounded-inside shadow-inside h-[10.5rem] group">
      <div class="flex flex-col gap-2">
         <div
            class="text-[1.25rem] font-bold group-hover:text-orange-high duration-300 transition-colors">
            {{ title }}
         </div>
         <div class="overflow-ellipsis line-clamp-3">
            {{ description }}
         </div>
         <div class="flex gap-5 text-[0.75rem] text-gray-500 mt-auto">
            <div>
               <i class="fas fa-clock mr-1.5"></i>
               {{ date ?? '未知日期' }}
            </div>
            <div>
               <i class="fas fa-user-astronaut mr-1.5"></i>
               {{ author ?? '匿名作者' }}
            </div>
         </div>
      </div>
      <div
         class="h-full w-[11.125rem] relative overflow-hidden bg-contain bg-gray-200 rounded-inside shrink-0 justify-center items-center flex">
         <Image class="absolute size-10 text-gray-400" />
         <img
            class="group-hover:scale-125 transition-transform duration-300 z-10"
            :src="imageUrl" />
      </div>
   </RouterLink>
</template>

<script setup lang="ts">
import { Image } from '@/components/Icons';

defineProps<{
   link?: string;
   title?: string;
   description?: string;
   date?: string;
   author?: string;
   imageUrl?: string;
}>();
</script>

<style scoped></style>
