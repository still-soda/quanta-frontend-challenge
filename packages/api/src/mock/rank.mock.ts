import { MockMethod } from './types';
import { RankApi } from '../apis';
import { GET } from './constants';
import { mock } from 'mockjs';
import { response } from './utils/response.utils';

// 生成 n 条排名数据
export function genRanks(n = 10) {
   return mock({
      [`data|${n}`]: [
         {
            userId: '@id',
            score: '@integer(10, 1000)',
            rank: '@integer(1, 100)',
            time: '@datetime',
         },
      ],
   }).data;
}

export default [
   {
      url: RankApi.GET_MY_HISTORY_RANK,
      method: GET,
      response: () => response('ok', genRanks(5), 'Mock: 获取成功'),
   },
   {
      url: RankApi.GET_OVERCOMING_PERCENT,
      method: GET,
      response: () =>
         response(
            'ok',
            mock({
               lower: '@integer(1, 100)',
               total: '@integer(1, 100)',
               percent: '@float(0, 1, 2, 2)',
            }),
            'Mock: 获取成功'
         ),
   },
   {
      url: RankApi.GET_RECENT_RANK,
      method: GET,
      response: () => response('ok', genRanks(5), 'Mock: 获取成功'),
   },
   {
      url: RankApi.GET_SCORE_INTERVAL,
      method: GET,
      response: () =>
         response(
            'ok',
            {
               min: mock('@integer(10, 100)'),
               max: mock('@integer(100, 1000)'),
            },
            'Mock: 获取成功'
         ),
   },
] satisfies MockMethod[];
