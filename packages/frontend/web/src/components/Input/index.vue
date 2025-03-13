<template>
   <div
      class="px-[0.875rem] py-[0.625rem] bg-dark-shallow rounded-inside flex flex-shrink-0 gap-[0.9375rem]"
      :class="{
         'ring-2 ring-offset-2 transition-all ring-transparent': validator,
         'has-[input:focus]:ring-red-shallow/80':
            validator && !validator(value),
         'has-[input:focus]:ring-green-base/80': validator && validator(value),
      }">
      <slot name="icon"></slot>
      <input
         :placeholder="placeholder"
         :title="title"
         :alt="alt"
         :name="name"
         :value="value"
         @input="emit('update:value', ($event.target as any).value)"
         type="text"
         class="bg-transparent border-none outline-none w-full placeholder:text-dark-to" />
   </div>
</template>

<script setup lang="ts">
defineProps<{
   value: string;
   validator?: (value: string) => boolean;
   name?: string;
   placeholder?: string;
   title?: string;
   alt?: string;
}>();

const emit = defineEmits(['update:value']);
</script>
