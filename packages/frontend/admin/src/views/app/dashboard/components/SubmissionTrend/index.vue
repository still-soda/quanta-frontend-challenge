<template>
   <div class="w-full flex flex-col gap-1">
      <div
         class="text-md font-bold mb-4 flex justify-between items-center pr-2">
         <div>近七日提交趋势</div>
         <div class="flex items-center gap-2">
            <TIcon
               :name="growthData > 0 ? 'trending-up' : 'trending-down'"
               :class="{
                  'text-green-base': growthData > 0,
                  'text-red-base': growthData < 0,
               }" />
            <span class="font-medium text-xs text-gray-600">
               {{ Math.abs(growthData).toFixed(2) }}%
            </span>
         </div>
      </div>
      <div class="h-64">
         <VueEchart :option="option" autoresize />
      </div>
   </div>
</template>

<script setup lang="ts">
import lineChartOption from './line-chart-option';
import VueEchart from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([GridComponent, TooltipComponent, LineChart, CanvasRenderer]);

const { data } = defineProps<{ data: number[] }>();
const option = lineChartOption(data);

// 最近两天环比增长
const lastTwoDaysGrowth = (data: number[]) => {
   const growth = data.slice(-2).map((value, index, arr) => {
      if (index === 0) return 0;
      return ((value - arr[index - 1]) / arr[index - 1]) * 100;
   });
   return growth;
};

const growthData = lastTwoDaysGrowth(data).pop() ?? 0;
</script>
