import { MockMethod } from 'vite-plugin-mock';
import { NotificationApi } from '../apis';
import { GET, NOTIFICATION_CONTENT } from './constants';
import { mock, Random } from 'mockjs';
import { response } from './utils/response.utils';

// 生成 n 条公告数据
export function genNotifications(n = 10) {
   return mock({
      [`data|${n}`]: [
         {
            title: '@ctitle',
            contentId: '@id',
            authorId: '@id',
            description: '@cparagraph',
            coverUrl: Random.image('100x100', Random.color(), Random.word(1)),
         },
      ],
   }).data;
}

export default <MockMethod[]>[
   {
      url: NotificationApi.GET_ALL_PUBLISHED_NOTIFICATIONS,
      method: GET,
      response: () => response('ok', genNotifications(), 'Mock: 获取成功'),
   },
   {
      url: NotificationApi.GET_NOTIFICATION_DETAIL,
      method: GET,
      response: () => response('ok', NOTIFICATION_CONTENT, 'Mock: 获取成功'),
   },
];
