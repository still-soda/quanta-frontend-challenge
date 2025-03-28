import { MockMethod } from './types';
import { ResolvedChallengeApi } from '../apis';
import { GET } from './constants';
import { mock } from 'mockjs';
import { response } from './utils/response.utils';

// 生成 n 条已解决挑战数据
export function genResolvedChallenge(n = 10) {
   return mock({
      [`data|${n}`]: [
         {
            id: '@id',
            challengeId: '@id',
            userId: '@id',
            resolvedAt: '@datetime',
            solution: '@integer(300, 700)',
            rank: '@integer(1, 100)',
         },
      ],
   }).data;
}

export default [
   {
      url: ResolvedChallengeApi.GET_EARLIEST_THREE_OF_CHALLENGE,
      method: GET,
      response: () => response('ok', genResolvedChallenge(3), 'Mock: 获取成功'),
   },
   {
      url: ResolvedChallengeApi.GET_EARLIEST_THREE_OF_USER,
      method: GET,
      response: () => response('ok', genResolvedChallenge(3), 'Mock: 获取成功'),
   },
] satisfies MockMethod[];
