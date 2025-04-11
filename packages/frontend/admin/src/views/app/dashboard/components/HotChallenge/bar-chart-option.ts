const barChartOption = (category: string[], data: [any, any][]) => ({
   tooltip: {
      trigger: 'axis',
      axisPointer: {
         type: 'shadow',
      },
   },
   grid: {
      left: 6,
      right: 12,
      top: 5,
      bottom: 12,
      containLabel: true,
   },
   yAxis: [
      {
         type: 'category',
         data: category,
      },
   ],
   axisLabel: {
      formatter: function (value: string) {
         const maxLength = 5; // 最长显示5个字符
         return value.length > maxLength
            ? value.slice(0, maxLength) + '…'
            : value;
      },
      interval: 0, // 强制显示所有标签
   },
   xAxis: [
      {
         type: 'value',
      },
   ],
   series: [
      {
         name: '提交次数',
         type: 'bar',
         barWidth: '30%',
         color: '#FF9232',
         itemStyle: {
            borderRadius: [0, 2, 2, 0],
         } as any,
         data: data.map((item) => item[0]),
      },
      {
         name: '通过次数',
         type: 'bar',
         barWidth: '30%',
         color: '#94B889',
         itemStyle: {
            borderRadius: [0, 2, 2, 0],
         } as any,
         data: data.map((item) => item[1]),
      },
   ],
});

export default barChartOption;
