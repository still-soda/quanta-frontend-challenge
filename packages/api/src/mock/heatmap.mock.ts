import { MockMethod } from './types';
import { CommitHeatmapApi } from '../apis';
import { GET } from './constants';
import { mock } from 'mockjs';
import { response } from './utils/response.utils';

// 生成 n 条提交热力图数据
export function genHeatmap(n = 10) {
   return mock({
      [`data|${n}`]: [
         {
            date: '@date',
            count: '@integer(1, 100)',
            userId: '@id',
         },
      ],
   }).data;
}

export default <MockMethod[]>[
   {
      url: CommitHeatmapApi.GET_HEATMAP,
      method: GET,
      response: () => response('ok', genHeatmap(), 'Mock: 获取成功'),
   },
];
