import { mock, Random } from 'mockjs';
import { response } from './utils/response.utils';
import { MockMethod } from './types';
import { ChallengeApi } from '../apis';
import { GET, MARKDOWN_SEQUENCE, POST } from './constants';
import { notAdmin } from './utils/check.utils';

// 生成 n 条挑战数据
export function genChallenges(n = 10, integral = false) {
   const extendPayload = integral
      ? {
           status: '@pick([0, 1, 2, 3])',
           contentId: '@id',
           flowdataId: '@id',
           'standardAnswer|2': ['@cparagraph'],
           'answerTemplate|2': ['@cparagraph'],
           'screenshots|2': [
              Random.image('100x100', Random.color(), Random.word(1)),
           ],
           'fastestSolvers|2': ['@id'],
        }
      : {};

   return mock({
      [`data|${n}`]: [
         {
            id: '@id',
            title: '@ctitle',
            difficulty: '@pick(["easy", "medium", "hard"])',
            score: '@integer(10, 100)',
            type: '@pick(["css", "javascript", "typescript"])',
            authorId: '@id',
            totalSubmissions: '@integer(10, 1000)',
            totalPass: '@integer(10, 1000)',
            'tags|2': [
               {
                  id: '@id',
                  name: '@pick(["CSS", "JavaScript", "TypeScript", "React", "Vue", "Angular"])',
                  description: '@cparagraph',
                  color: '@hex',
                  creatorId: '@id',
                  createdAt: '@datetime',
                  updatedAt: '@datetime',
                  icon: Random.image('100x100', Random.color(), Random.word(1)),
               },
            ],
            updatedAt: '@datetime',
            createdAt: '@datetime',
            ...extendPayload,
         },
      ],
   }).data;
}

export default [
   {
      url: ChallengeApi.GET_ALL_PUBLISHED_CHALLENGES,
      method: GET,
      response: () => response('ok', genChallenges(), 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.ADMIN_GET_ALL_CHALLENGES,
      method: GET,
      response: ({ headers }: any) =>
         notAdmin(headers)
            ? response('forbidden', null, 'Mock: 无权限')
            : response('ok', genChallenges(10, true), 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.GET_CHALLENGES_TOTAL_SCORE,
      method: GET,
      response: () =>
         response('ok', Random.integer(10, 1000), 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.GET_CHALLENGE_BY_ID,
      method: GET,
      response: () => response('ok', genChallenges(1), 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.GET_CHALLENGE_DETAIL,
      method: GET,
      response: ({ headers }: any) =>
         notAdmin(headers)
            ? response('forbidden', null, 'Mock: 无权限')
            : response('ok', MARKDOWN_SEQUENCE, 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.GET_DOWNLOAD_URL_OF_ANSWER_TEMPLATE,
      method: GET,
      response: () => response('ok', [mock('@url')], 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.GET_LASTEST_CHALLENGES,
      method: GET,
      response: () => response('ok', genChallenges(5), 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.UPLOAD_ANSWER,
      method: POST,
      response: () => response('ok', [mock('@id')], 'Mock: 上传成功'),
   },
   {
      url: ChallengeApi.ADMIN_GET_CHALLENGE_DETAIL,
      method: GET,
      response: ({ headers }: any) =>
         notAdmin(headers)
            ? response('forbidden', null, 'Mock: 无权限')
            : response('ok', MARKDOWN_SEQUENCE, 'Mock: 获取成功'),
   },
   {
      url: ChallengeApi.ADMIN_GET_CHALLENGE_BY_ID,
      method: GET,
      response: () => response('ok', genChallenges(1, true), 'Mock: 获取成功'),
   },
] satisfies MockMethod[];
