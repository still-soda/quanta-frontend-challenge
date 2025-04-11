<template>
   <div class="w-full flex flex-col gap-1">
      <div class="text-md font-bold mb-4">难度分布</div>
      <div class="h-64">
         <VueEchart :option autoresize />
      </div>
   </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
   TitleComponent,
   TooltipComponent,
   LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VueEchart from 'vue-echarts';
import pieChartOption from './pie-chart-option';

const option = pieChartOption({
   easy: 335,
   medium: 310,
   hard: 234,
});

use([
   TitleComponent,
   TooltipComponent,
   LegendComponent,
   PieChart,
   CanvasRenderer,
]);
</script>
