import { CommitHeatmap } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

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
