<template>
   <div class="w-full flex flex-col gap-1">
      <div class="text-md font-bold mb-4">提交量排名</div>
      <div class="h-64" ref="chartContainer">
         <VueEchart ref="chart" :option="barChartOption" autoresize />
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
import { onMounted, nextTick, useTemplateRef } from 'vue';

use([
   TooltipComponent,
   GridComponent,
   BarChart,
   CanvasRenderer,
   GraphicComponent,
   LegendComponent,
]);

const props = defineProps<{
   imageSize?: number;
}>();

const chartRef = useTemplateRef<InstanceType<typeof VueEchart>>('chart');
const updateChartGraphic = () => {
   const echartsInstance = chartRef.value?.chart;
   if (!echartsInstance) return;

   const seriesData = (barChartOption.series?.[0]?.data || []) as number[];
   const imageUrl =
      'https://pic2.zhimg.com/v2-4db584be87aa0150e0ae34a8a1059e94_r.jpg';
   const imageSize = props.imageSize || 25;

   const option: any = echartsInstance.getOption();
   option.grid.top = imageSize + 5;
   option.graphic = seriesData.map((_, i) => {
      const [xPixel, yPixel] = echartsInstance.convertToPixel(
         { xAxisIndex: 0, yAxisIndex: 0 },
         [i, seriesData[i]]
      );

      return {
         type: 'image',
         style: {
            image: imageUrl,
            width: imageSize,
            height: imageSize,
         },
         clipPath: {
            type: 'circle',
            shape: {
               cx: imageSize / 2,
               cy: imageSize / 2,
               r: imageSize / 2,
            },
         },
         z: 10,
         bounding: 'raw',
         position: [0, 0],
         left: xPixel - imageSize / 2,
         top: yPixel - imageSize - 5,
      };
   });

   echartsInstance.setOption(option);
};

const observer = new ResizeObserver(updateChartGraphic);
const chartContainer = useTemplateRef<HTMLElement>('chartContainer');
onMounted(() => {
   chartContainer.value && observer.observe(chartContainer.value);
   nextTick(updateChartGraphic);
   setTimeout(updateChartGraphic);
});
</script>
