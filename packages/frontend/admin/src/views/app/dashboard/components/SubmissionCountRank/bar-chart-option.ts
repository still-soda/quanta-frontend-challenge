const barChartOption = {
   tooltip: {
      trigger: 'axis',
      axisPointer: {
         type: 'shadow',
      },
   },
   grid: {
      left: 12,
      right: 12,
      top: 30,
      bottom: 12,
      containLabel: true,
   },
   xAxis: [
      {
         type: 'category',
         data: new Array(10).fill(0).map((_, i) => `NO.${i + 1}`),
      },
   ],
   yAxis: [
      {
         type: 'value',
      },
   ],
   series: [
      {
         name: '提交次数',
         type: 'bar',
         barWidth: '60%',
         color: '#FF9232',
         itemStyle: {
            borderRadius: [4, 4, 0, 0],
         } as any,
         data: [10, 52, 200, 334, 390, 330, 220, 182, 434, 791].sort(
            (a, b) => b - a
         ),
      },
   ],
};

export default barChartOption;
