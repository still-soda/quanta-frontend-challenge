import { CommitHeatmap } from '@/models/commit-heatmap.model';

/**
 * 活动数据
 */
export type AcitveDataType = {
   [year: number]: {
      [month: number]: {
         [day: number]: {
            level: 'low' | 'mid' | 'high';
            submit: number;
         };
      };
   };
};

/**
 * 将热力图数据转换为活动数据
 * @param heatmap 热力图数据
 * @returns 活动数据
 */
export function toActiveData(heatmap: CommitHeatmap[]): AcitveDataType {
   const activeData: AcitveDataType = {};
   const status = ['low', 'mid', 'high'] as const;

   heatmap.forEach((item) => {
      const date = new Date(item.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate() - 1;
      // 0-3 low, 4-7 mid, 8+ high
      const level = status[Math.min(Math.floor(item.count / 4), 2)];
      const submit = item.count;

      if (!activeData[year]) {
         activeData[year] = {};
      }

      if (!activeData[year][month]) {
         activeData[year][month] = {};
      }

      activeData[year][month][day] = {
         level,
         submit,
      };
   });

   return activeData;
}
