const difficultyMap = {
   easy: '简单',
   medium: '中等',
   hard: '困难',
};

const pieChartOption = (data: {
   easy: number;
   medium: number;
   hard: number;
}) => ({
   tooltip: {
      trigger: 'item',
      formatter: '{b} : {d}%',
   },
   grid: {
      left: 6,
      right: 12,
      top: 0,
      bottom: 12,
      containLabel: true,
   },
   color: ['#94B889', '#FF9232', '#FF6565'],
   legend: {
      orient: 'horizontal',
      bottom: 10,
      data: ['简单', '中等', '困难'],
   },
   series: [
      {
         name: '难度占比',
         type: 'pie',
         radius: ['40%', '70%'],
         center: ['50%', '40%'],
         padAngle: 5,
         itemStyle: {
            borderRadius: 4,
         },
         label: {
            show: false,
            position: 'center',
         },
         labelLine: {
            show: false,
         },
         data: Object.entries(data).map(([key, value]) => ({
            name: difficultyMap[key as keyof typeof difficultyMap],
            value,
         })),
      },
   ],
});

export default pieChartOption;
