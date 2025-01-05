<template>
   <BaseContainer title="挑战热力图" class="h-full col-span-2">
      <div class="flex justify-center items-center h-full">
         <HeatMap :active-data="activeMock" />
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import activeMock from '@/mock/active.mock';
import { HeatMap, BaseContainer } from '@/components';
</script>
