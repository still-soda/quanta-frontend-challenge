<template>
   <BaseContainer title="挑战热力图" class="h-full col-span-2">
      <div class="flex justify-center items-center h-full">
         <HeatMap :active-data="activeData" />
      </div>
   </BaseContainer>
</template>

<script setup lang="ts">
import {
   AcitveDataType,
   toActiveData,
} from '@/adapters/heatmapToActiveData.adapter';
import { getHeatmapData } from '@/apis/heatmap.api';
import { HeatMap, BaseContainer, useMessage } from '@/components';
import { onMounted, ref } from 'vue';

const message = useMessage();

const activeData = ref<AcitveDataType>({});

// 获取热力图数据
async function getActiveData() {
   try {
      const { data } = await getHeatmapData();
      activeData.value = toActiveData(data);
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
      activeData.value = {};
   }
}

onMounted(() => getActiveData());
</script>
