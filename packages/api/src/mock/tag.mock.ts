import { MockMethod } from 'vite-plugin-mock';
import { TagApi } from '../apis';
import { mock, Random } from 'mockjs';
import { GET } from './constants';
import { response } from './utils/response.utils';

// 生成 n 条标签数据
export function genTags(n = 10) {
   return mock({
      [`data|${n}`]: [
         {
            _id: '@id',
            name: '@name',
            description: '@sentence',
            color: '@color',
            icon: Random.image('100x100', Random.color(), Random.word(1)),
            creatorId: '@id',
            updatedAt: '@date',
            createdAt: '@date',
         },
      ],
   }).data;
}

export default <MockMethod[]>[
   {
      url: TagApi.FIND_BY_IDS,
      method: GET,
      response: ({ body }: any) =>
         response(
            'ok',
            genTags(body?.id?.length ?? 10),
            'Mock: 获取标签列表成功'
         ),
   },
   {
      url: TagApi.GET_ALL_TAGS,
      method: GET,
      response: () => response('ok', genTags(10), 'Mock: 获取标签列表成功'),
   },
   {
      url: TagApi.GET_TAG_BY_ID,
      method: GET,
      response: () => response('ok', genTags(1)[0], 'Mock: 获取标签成功'),
   },
];
