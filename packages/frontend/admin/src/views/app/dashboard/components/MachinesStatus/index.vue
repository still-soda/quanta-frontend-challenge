<template>
   <div class="w-full flex flex-col gap-2">
      <div class="text-md font-bold mb-2">判题机状态</div>
      <div class="flex flex-col gap-2 h-64 overflow-auto">
         <div
            class="flex justify-between py-2 px-4 items-center bg-gray-100 rounded-md"
            v-for="machine in machines"
            :key="machine.id">
            <div class="flex flex-col">
               <div
                  class="font-medium text-md text-gray-500 flex items-center gap-1">
                  <TIcon name="server" />
                  {{ machine.name }}
               </div>
               <div
                  :class="{
                     'text-green-base': machine.status === 'running',
                     'text-orange-high': machine.status === 'idle',
                     'text-red-base': machine.status === 'error',
                  }">
                  {{ statusText[machine.status] }}
               </div>
            </div>
            <div
               class="size-3 rounded-full"
               :class="{
                  'bg-green-base': machine.status === 'running',
                  'bg-orange-high': machine.status === 'idle',
                  'bg-red-base': machine.status === 'error',
               }"></div>
         </div>
      </div>
   </div>
</template>

<script setup lang="ts">
interface Machine {
   id: string;
   name: string;
   status: 'running' | 'idle' | 'error';
}

const statusText = {
   running: '运行中',
   idle: '空闲中',
   error: '错误',
};

const machines: Machine[] = [
   { id: '1', name: 'Machine A', status: 'running' },
   { id: '2', name: 'Machine B', status: 'idle' },
   { id: '3', name: 'Machine C', status: 'error' },
];
</script>
