<template>
   <MessageProvider>
      <RouterView />
   </MessageProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { MessageProvider } from '@/components';
</script>
