<template>
   <div
      class="relative px-4 py-3 rounded-inside shadow-md text-dark-normal bg-white text-opacity-80">
      <slot :text="text">
         <div class="flex gap-3 items-center text-nowrap">
            <slot v-if="!noIcon" name="icon">
               <i
                  v-if="props.type === 'info'"
                  class="fas fa-circle-info text-blue-400"></i>
               <i
                  v-else-if="props.type === 'warning'"
                  class="fas fa-circle-exclamation text-orange-400"></i>
               <i
                  v-else-if="props.type === 'success'"
                  class="fas fa-circle-check text-green-400"></i>
               <i v-else class="fas fa-circle-xmark text-red-400"></i
            ></slot>
            <slot name="text">{{ text }}</slot>
         </div>

         <div v-if="confirm" class="w-full flex justify-end mt-3 gap-3">
            <Button class="!px-2 !py-1 text-sm" @click="emits('confirm', id)">
               确认
            </Button>
            <Button
               class="!px-2 !py-1 text-sm"
               type="secondary"
               @click="emits('cancel', id)">
               取消
            </Button>
         </div>
      </slot>
   </div>
</template>

<script setup lang="ts">
import { MessageType } from './message.types';
import { Button } from '..';

const props = defineProps<{
   type: MessageType;
   text: string;
   id: string;
   noIcon?: boolean;
   confirm?: boolean;
}>();

const emits = defineEmits(['confirm', 'cancel']);
</script>
