const last7Days = Array.from({ length: 7 }, (_, i) => {
   const date = new Date();
   date.setDate(date.getDate() - i);
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   return `${month}-${day}`;
}).reverse();

const lineChartOption = (data: number[]) => ({
   grid: {
      left: 12,
      right: 12,
      top: 16,
      bottom: 12,
      containLabel: true,
   },
   xAxis: {
      type: 'category',
      data: last7Days,
   },
   yAxis: {
      type: 'value',
   },
   series: [
      {
         data,
         type: 'line',
         smooth: true,
         symbolSize: 12,
         color: '#FF9232',
      },
   ],
   tooltip: {
      trigger: 'axis',
      axisPointer: {
         type: 'cross',
         label: {
            backgroundColor: '#6a7985',
         },
      },
      formatter: (params: any) => {
         const date = params[0].name;
         const value = params[0].value;
         return `日期：${date}<br/>人数：${value}`;
      },
   },
   legend: {
      data: ['Data'],
      textStyle: {
         color: '#fff',
         fontSize: 12,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 12,
      top: 10,
      right: 20,
      orient: 'horizontal',
      align: 'left',
      icon: 'rect',
      formatter: (name: string) => {
         return name;
      },
   },
});

export default lineChartOption;
