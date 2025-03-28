import { MockMethod } from './types';
import { SubmissionApi } from '../apis';
import { GET, SUBMISSION_MESSAGE } from './constants';
import { response } from './utils/response.utils';
import { mock } from 'mockjs';

// 生成 n 条提交数据
export function genSubmission(n = 10) {
   return mock({
      [`data|${n}`]: [
         {
            _id: '@id',
            challengeId: '@id',
            userId: '@id',
            type: '@pick(["execute", "preexecute"])',
            score: '@integer(0, 100)',
            correctRate: '@float(0, 1, 2, 2)',
            status: '@pick(["pending", "passed", "failed"])',
            message: [SUBMISSION_MESSAGE, SUBMISSION_MESSAGE],
            screenshotIds: ['@id', '@id'],
            solution: '@integer(300, 700)',
            createdAt: '@datetime',
            updatedAt: '@datetime',
         },
      ],
   }).data;
}

export default [
   {
      url: SubmissionApi.GET_CHALLENGE_PASSED_RATE,
      method: GET,
      response: () =>
         response(
            'ok',
            {
               rate: mock('@float(0, 1, 2, 2)'),
               total: mock('@integer(1, 100)'),
               passed: mock('@integer(0, 100)'),
            },
            'Mock: 获取成功'
         ),
   },
   {
      url: SubmissionApi.GET_MAX_CORRECT_RATE,
      method: GET,
      response: () =>
         response('ok', mock('@float(0, 1, 2, 2)'), 'Mock: 获取成功'),
   },
   {
      url: SubmissionApi.GET_MY_RECENT_SUBMISSION,
      method: GET,
      response: () => response('ok', genSubmission(5), 'Mock: 获取成功'),
   },
   {
      url: SubmissionApi.GET_MY_SUBMISSIONS,
      method: GET,
      response: () => response('ok', genSubmission(5), 'Mock: 获取成功'),
   },
   {
      url: SubmissionApi.GET_MY_SUBMISSIONS_IN_CHALLENGE,
      method: GET,
      response: () => response('ok', genSubmission(5), 'Mock: 获取成功'),
   },
   {
      url: SubmissionApi.GET_SUBMISSION_BY_ID,
      method: GET,
      response: () => response('ok', genSubmission(1), 'Mock: 获取成功'),
   },
   {
      url: SubmissionApi.GET_SUBMIT_COUNT_OF_CHALLENGE,
      method: GET,
      response: () =>
         response('ok', { count: mock('@integer(1, 100)') }, 'Mock: 获取成功'),
   },
] satisfies MockMethod[];
