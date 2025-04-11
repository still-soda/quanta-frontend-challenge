<template>
   <div class="w-full flex flex-col gap-1">
      <div class="text-md font-bold mb-4">热门题目</div>
      <div class="h-64">
         <VueEchart :option autoresize />
      </div>
   </div>
</template>

<script setup lang="ts">
import VueEchart from 'vue-echarts';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
   TooltipComponent,
   GridComponent,
   GraphicComponent,
   LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import barChartOption from './bar-chart-option';

const option = barChartOption(
   [
      '一个简单到不能再简单的题目',
      '一个简单到不能再简单的题目',
      '一个简单到不能再简单的题目',
      '一个简单到不能再简单的题目',
      '一个简单到不能再简单的题目',
   ],
   [
      [100, 75],
      [200, 150],
      [300, 225],
      [400, 300],
      [500, 375],
   ]
);

use([
   TooltipComponent,
   GridComponent,
   BarChart,
   CanvasRenderer,
   GraphicComponent,
   LegendComponent,
]);
</script>
