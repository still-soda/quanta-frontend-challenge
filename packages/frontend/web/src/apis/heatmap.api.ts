import { CommitHeatmap } from '@/models/commit-heatmap.model';
import { RequestResult } from '@/types/request';
import { get } from '@challenge/api';

/**
 * 获取提交热力图数据
 * @api /commit-heatmap/get-heatmap
 * @returns 提交热力图数据
 */
export async function getHeatmapData() {
   const response = await get<RequestResult<CommitHeatmap[]>>(
      '/commit-heatmap/get-heatmap'
   );
   return response;
}
