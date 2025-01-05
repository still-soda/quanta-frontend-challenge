<template>
   <div class="flex flex-col gap-2 relative">
      <div
         @click="onClick"
         @dragenter="onDragEnter"
         @dragleave="onDragLeave"
         @dragover="onDragOver"
         @drop="onDrop"
         ref="uploader"
         class="w-full h-full bg-[#F1F0F0] rounded-md py-10 flex items-center justify-center flex-col gap-[0.62rem] hover:bg-[#e9e9e9] transition-all hover:cursor-pointer"
         :class="{
            'hover:!cursor-not-allowed text-gray-400 !bg-[#F1F0F0]':
               shouldDisable(),
         }">
         <input
            ref="input"
            type="file"
            class="hidden"
            :accept="accept"
            @change="onInputChange" />
         <UploadFile />
         <slot name="requirement">
            <div class="text-[0.9375rem]">要求 .html 文件</div>
         </slot>
         <slot name="notice">
            <div class="text-xl">拖动文件至此或点击来上传文件</div>
         </slot>
      </div>
      <div class="flex flex-col gap-2">
         <TransitionGroup name="files" :duration="{ enter: 300, leave: 0 }">
            <div
               v-for="(file, idx) in files"
               :key="idx"
               class="py-2 px-4 rounded-md shadow-inside flex gap-2 items-center w-full">
               <Check class="text-green-base size-5" />
               {{ file.name }}
               <Tag type="success" class="pb-1 pt-0 ml-auto">
                  {{ file.name.split('.').pop() }}
               </Tag>
               <div
                  @click="files = files.filter((item) => item !== file)"
                  class="text-gray-300 hover:text-red-base transition-colors hover:cursor-pointer ml-1">
                  <i class="fa fa-trash"></i>
               </div>
            </div>
         </TransitionGroup>
      </div>
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadFile, Check } from '../Icons';
import { Tag } from '..';

const uploader = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);

const props = defineProps<{
   disabled?: boolean;
   maxFileCounts?: number;
   accept?: string;
}>();

const shouldDisable = () =>
   props.disabled || files.value.length >= (props.maxFileCounts ?? Infinity);

const onDragEnter = () => {
   if (shouldDisable()) {
      return;
   }
   uploader.value?.classList.add('active');
};

const onDragLeave = () => {
   if (shouldDisable()) {
      return;
   }
   uploader.value?.classList.remove('active');
};

const onDragOver = (e: DragEvent) => e.preventDefault();

const onDrop = (e: DragEvent) => {
   e.preventDefault();
   if (!e.dataTransfer?.files || shouldDisable()) {
      return;
   }
   uploader.value?.classList.remove('active');
   files.value.push(...e.dataTransfer.files);
};

const onClick = () => {
   if (!input.value || shouldDisable()) {
      return;
   }
   input.value.click();
};

const onInputChange = () => {
   if (!input.value?.files) {
      return;
   }
   files.value.push(...input.value.files);
};
</script>

<style scoped>
.active {
   @apply bg-[#e9e9e9];
}

.files-enter-active,
.files-leave-active {
   transition: all 0.3s;
}

.files-enter-from,
.files-leave-to {
   opacity: 0;
   transform: translateX(-0.5rem);
}

.files-enter-to,
.files-leave-from {
   opacity: 1;
   transform: translateY(0);
}
</style>
