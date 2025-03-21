import { MockMethod } from './types';
import { UserApi } from '../apis';
import { AVATAR_SVG, GET, POST } from './constants';
import { response } from './utils/response.utils';
import { mock, Random } from 'mockjs';

// 生成 n 条用户数据
export function genUsers(n = 10, self = false) {
   let config: any = {
      username: '@name',
      id: '@id',
      avatar: Random.image('100x100', Random.color(), Random.word(1)),
      email: '@email',
      signature: '@sentence',
      totalSubmissions: '@integer(0, 100)',
   };

   self &&
      (config = {
         ...config,
         totalScore: '@integer(0, 100)',
         solvedTasks: ['@id', '@id', '@id'],
         tryingTasks: [],
         failedTasks: ['@id', '@id', '@id'],
         number: '@string("number", 11)',
         role: '@pick([1, 2, 3])',
      });

   return mock({
      [`data|${n}`]: [config],
   }).data;
}

export default <MockMethod[]>[
   {
      url: UserApi.GET_DEFAULT_AVATAR,
      method: GET,
      response: () => response('ok', { avatar: AVATAR_SVG }, 'Mock: 获取成功'),
   },
   {
      url: UserApi.GET_SELF,
      method: GET,
      response: () => response('ok', genUsers(1, true), 'Mock: 获取成功'),
   },
   {
      url: UserApi.GET_USER_BY_ID,
      method: GET,
      response: () => response('ok', genUsers(1), 'Mock: 获取成功'),
   },
   {
      url: UserApi.GET_USER_BY_USERNAME,
      method: GET,
      response: () => response('ok', genUsers(1), 'Mock: 获取成功'),
   },
   {
      url: UserApi.UPDATE_SELF,
      method: POST,
      response: () => response('ok', genUsers(1, true), 'Mock: 更新成功'),
   },
   {
      url: UserApi.UPLOAD_AVATAR,
      method: POST,
      response: () => response('ok', undefined, 'Mock: 上传成功'),
   },
];
