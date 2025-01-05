<template>
   <div
      ref="chartContainer"
      :style="{
         width: `${width ?? 300}px`,
         height: `${height ?? 300}px`,
      }"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { range } from '@challenge/utils';
import { MONTH_TEXT } from '@/constant/date.constant';

/**
 * @description 柱状图组件参数
 * @param width      宽度
 * @param height     高度
 */
const props = defineProps<{
   width?: number;
   height?: number;
   startMonth?: number;
   endMonth?: number;
   data: number[];
}>();

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let option: echarts.EChartsOption = {};

onMounted(init);
function init() {
   if (!chartContainer.value) {
      return;
   }
   chartInstance = echarts.init(chartContainer.value, null, {
      renderer: 'canvas',
      useDirtyRect: false,
   });

   const monthText = range(props.startMonth ?? 0, props.endMonth ?? 12).map(
      (month) => MONTH_TEXT[month]
   );

   // [60, 53, 50, 55, 40, 48]

   // ECharts 配置项
   option = {
      xAxis: {
         type: 'category', // X轴使用离散类型
         boundaryGap: false, // 不让坐标轴留有空隙
         data: monthText,
         axisTick: { show: false },
         axisLabel: {
            margin: 12,
            fontSize: 12,
         },
         axisLine: {
            lineStyle: {
               color: '#888',
            },
         },
      },
      yAxis: {
         type: 'value',
         position: 'right',
         min: 'dataMin',
         max: 'dataMax',
         inverse: true,
         axisLabel: {
            margin: 22,
            fontSize: 12,
            fontWeight: 'bold',
         },
      },
      tooltip: {
         trigger: 'axis',
         axisPointer: {
            type: 'line',
            lineStyle: {
               color: '#FF923288',
            },
         },
         formatter: '{b}排名：{c}',
      },
      series: [
         {
            name: '排名',
            data: props.data,
            symbolSize: 0, // 控制标记大小
            type: 'line',
            color: '#FF9232',
            smooth: true,
            areaStyle: {
               origin: 'end',
               color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                     offset: 0,
                     color: 'rgba(255, 146, 50, 0.9)',
                  },
                  {
                     offset: 1,
                     color: 'rgba(255, 146, 50, 0.1)',
                  },
               ]),
            },
         },
      ],
      grid: {
         left: '25px',
         right: '45px',
         top: '5%',
         bottom: '25px',
      },
   };

   if (option && typeof option === 'object') {
      chartInstance.setOption(option);
   }

   window.addEventListener('resize', () => chartInstance!.resize());
}

watch(
   () => [props.width, props.height],
   () => {
      nextTick(() => {
         if (chartInstance) {
            chartInstance.resize();
         }
      });
   }
);

watch(
   () => [props.startMonth, props.endMonth, props.data],
   () => {
      init();
   },
   { deep: true }
);
</script>
