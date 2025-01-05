<template>
   <table class="w-full">
      <colgroup>
         <slot name="cols" />
      </colgroup>
      <thead
         class="border-b-[1px] border-dark-normal sticky top-0 bg-white z-10">
         <tr>
            <th
               class="font-medium text-start indent-1 py-[0.62rem]"
               v-for="(key, idx) in computedOrder"
               :key="`head-${idx}`">
               <slot name="header" :key="key" :idx="idx">
                  <slot :name="`head-${key}`" :key="key" :idx="idx">
                     {{ key }}
                  </slot>
               </slot>
            </th>
         </tr>
      </thead>
      <tbody>
         <tr
            v-for="(item, idx) in data"
            :key="`tr-${idx}`"
            class="even:bg-[#EBEBEB]">
            <td
               v-for="key in computedOrder"
               class="p-[0.625rem]"
               :key="`td-${key}-${idx}`">
               <slot :name="`${key}`" :value="item[key]" :idx="idx">
                  {{ item[key] }}
               </slot>
            </td>
         </tr>
      </tbody>
   </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
   data: {
      [key: string]: any;
   }[];
   order?: string[];
}>();

const computedOrder = computed(() => {
   if (props.order) {
      return props.order;
   } else if (props.data.length) {
      return Object.keys(props.data[0]);
   } else {
      return [];
   }
});
</script>
