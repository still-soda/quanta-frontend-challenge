<template>
   <div class="relative">
      <div
         class="fixed w-full h-full flex p-2 pointer-events-none z-50"
         :class="{
            'justify-center': position.includes('c'),
            'justify-start': position.includes('l'),
            'justify-end': position.includes('r'),
            'items-start': position.includes('t'),
            'items-end': position.includes('b'),
         }">
         <TransitionGroup
            name="message"
            tag="main"
            class="relative h-fit flex flex-col gap-2 z-50 pointer-events-auto"
            :class="{
               'items-center': position.includes('c'),
               'items-start': position.includes('l'),
               'items-end': position.includes('r'),
            }">
            <Item
               class="z-10"
               v-for="msg in messages"
               :id="msg.id"
               :key="msg.id"
               :type="msg.type"
               :text="msg.text"
               :confirm="msg.confirm"
               @confirm="confirm"
               @cancel="cancel" />
         </TransitionGroup>
      </div>
      <slot></slot>
   </div>
</template>

<script setup lang="ts">
import { Message, MessageType, MethodsOptions } from './message.types';
import Item from './Item.vue';
import { provide, ref } from 'vue';
import { generateUUID } from '@challenge/utils';
import { ProvidedMethods } from './message.types';

const { position = 'ct' } = defineProps<{
   position?: 'lt' | 'ct' | 'rt' | 'lb' | 'cb' | 'rb';
}>();

const messages = ref<Message[]>([]);

function send(
   type: MessageType,
   text: string,
   { duration, confirm }: MethodsOptions
) {
   const id = generateUUID();
   messages.value.push({
      type,
      text,
      id,
      duration,
      confirm,
   });
   duration &&
      !confirm &&
      setTimeout(() => {
         messages.value = messages.value.filter((msg) => msg.id !== id);
      }, duration);
}

const success = (text: string, options: MethodsOptions) =>
   send('success', text, options);
const error = (text: string, options: MethodsOptions) =>
   send('error', text, options);
const warning = (text: string, options: MethodsOptions) =>
   send('warning', text, options);
const info = (text: string, options: MethodsOptions) =>
   send('info', text, options);

const providedMethods: ProvidedMethods = {
   send,
   success,
   error,
   warning,
   info,
};

provide('__message_provider__', providedMethods);

function confirm(id: string) {
   messages.value = messages.value.filter((msg) => msg.id !== id);
   success('操作成功', { duration: 2000 });
}

function cancel(id: string) {
   messages.value = messages.value.filter((msg) => msg.id !== id);
   error('操作取消', { duration: 2000 });
}
</script>

<style lang="css" scoped>
.message-move,
.message-enter-active,
.message-leave-active {
   transition: all 0.4s ease;
}

.message-enter-active {
   transition-timing-function: cubic-bezier(0.1, -0.3, 0.2, 1.7);
}

.message-leave-active {
   transition-timing-function: ease-out;
}

.message-enter-from,
.message-leave-to {
   opacity: 0;
   transform: scale(0.5);
}

.message-leave-from {
   z-index: 0;
}

.message-leave-active {
   position: absolute;
}
</style>
