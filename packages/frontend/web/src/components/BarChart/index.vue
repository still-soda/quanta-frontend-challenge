<template>
   <div
      ref="chartContainer"
      :style="{
         width: `${widthNumber ?? 300}px`,
         height: `${heightNumber ?? 300}px`,
      }"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { parseToPixels } from '@challenge/utils';

/**
 * @description 柱状图组件参数
 * @param width      宽度
 * @param height     高度
 * @param segments   区间数
 * @param users      用户信息
 * @param imageSize  用户头像大小
 * @param scores     分数信息
 */
const props = defineProps<{
   width?: number | string;
   height?: number | string;
   segments?: number;
   users?: { score: number; avatar: string }[];
   imageSize?: number;
   scores: { score: number }[];
}>();

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let option: echarts.EChartsOption = {};

function asNumber(value: string | number) {
   return typeof value === 'string' ? parseToPixels(value) : value;
}

const widthNumber = asNumber(props.width ?? 300);
const heightNumber = asNumber(props.height ?? 300);

onMounted(init);
function init() {
   if (!chartContainer.value) {
      return;
   }
   chartInstance = echarts.init(chartContainer.value, null, {
      renderer: 'canvas',
      useDirtyRect: false,
   });

   const data = [...(props.scores ?? []), ...(props.users ?? [])];
   const scores = data.map((i) => i.score);
   const min = Math.min(...scores);
   const max = Math.max(...scores);
   const segments = props.segments ?? 11;
   const step = (max - min) / segments;

   // 分数区间定义
   const ranges = (() => {
      let before = min;
      const res: string[] = [];
      for (let i = min + step; i <= max; i += step) {
         res.push(`${before.toFixed(0)}~${i.toFixed(0)}`);
         before = i;
      }
      return res;
   })();
   const rangeCounts = Array(ranges.length).fill(0);

   // 统计分数区间
   data.forEach(({ score }) => {
      const index = Math.min(
         Math.floor((score - min) / step),
         ranges.length - 1
      );
      rangeCounts[index]++;
   });

   // 计算百分比
   const totalScores = data.length;
   const percentages = rangeCounts.map((count) =>
      ((count / totalScores) * 100).toFixed(2)
   );

   // ECharts 配置项
   option = {
      xAxis: {
         type: 'category',
         data: ranges,
         name: '',
         nameLocation: 'middle',
         nameGap: 30,
         axisLabel: {
            formatter: (value, idx) => {
               return idx % 2 === 1 ? value : value;
            },
            align: 'center', // 对齐方式居中
            margin: 20,
            rotate: 30,
            fontFamily: 'Montserrat', // 字体类型
            color: '#6F6F6F', // 字体颜色
            fontSize: '10px',
         },
         axisTick: {
            show: false, // 禁用刻度线
         },
      },
      yAxis: {
         type: 'value',
         name: '',
         nameLocation: 'middle',
         nameGap: 40,
         axisLabel: {
            formatter: (value) => {
               return `${value}%`;
            },
            margin: 10,
            fontSize: 12, // 字体大小
            fontFamily: 'Montserrat', // 字体类型
            color: '#6F6F6F', // 字体颜色
         },
         splitLine: {
            show: true,
            lineStyle: {
               type: 'dashed',
            },
         },
         position: 'right',
         splitNumber: 2,
      },
      tooltip: {
         trigger: 'axis',
         axisPointer: {
            type: 'none', // 禁用竖直线
         },
         formatter: (params: any) => {
            const { name, dataIndex } = params[0];
            const [min, max] = name.split('~');
            return `[${min}%, ${max}%): ${rangeCounts[dataIndex]}人`;
         },
      },
      series: [
         {
            data: percentages,
            type: 'bar',
            barWidth: '80%',
            color: '#FF9232',
            itemStyle: {
               barBorderRadius: [2, 2, 0, 0],
            } as any,
            emphasis: {
               itemStyle: {
                  // hover状态下的颜色
                  color: '#FF5722', // 设置hover时的变色为 #FF5722
               },
            },
         },
      ],
      grid: {
         right: '40px', // 距离容器右侧 10%，防止超出
         left: '20px',
         top: '15px',
         bottom: '43px',
      },
   };

   if (option && typeof option === 'object') {
      chartInstance.setOption(option);
   }

   window.addEventListener('resize', () => chartInstance!.resize());
   window.addEventListener('resize', updateImage);

   updateImage();
   function updateImage() {
      const users = props.users ?? [];
      option.graphic = users.map(({ score, avatar }) => {
         const index = Math.min(
            Math.floor((score - min) / step),
            ranges.length - 1
         );
         const dataIndex = index;
         const imageSize = props.imageSize ?? 20;

         const coord = chartInstance!.convertToPixel(
            { xAxisIndex: 0, yAxisIndex: 0 },
            [ranges[dataIndex], percentages[dataIndex]]
         );

         return {
            type: 'image',
            z: 10,
            style: {
               image: avatar,
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
            position: [0, 0], // 初始位置
            bounding: 'raw',
            left: coord[0] - imageSize / 2, // 横向居中
            top: coord[1] - 25, // 上移到柱子顶部
         };
      });
      chartInstance!.setOption(option);
   }
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
   () => [props.users, props.scores, props.imageSize],
   () => {
      init();
   },
   { deep: true }
);
</script>
