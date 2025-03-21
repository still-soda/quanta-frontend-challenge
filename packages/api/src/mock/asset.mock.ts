import { MockMethod } from './types';
import { AssetApi } from '../apis';
import { mock } from 'mockjs';
import { GET, POST } from './constants';
import { response } from './utils/response.utils';

// 生成 n 条资源数据
export function genAssets(n = 1) {
   return mock({
      [`data|${n}`]: [
         {
            localName: '@id' + '.@pick(["png", "jpg", "jpeg"])',
            name: '@ctitle',
            mimeType: '@pick(["text/plain", "image/webp"])',
         },
      ],
   }).data;
}

export default <MockMethod[]>[
   {
      url: AssetApi.GET_STATIC_FILE_METADATA,
      method: POST,
      response: ({ body }: any) => {
         const { fileIdList } = JSON.parse(body);
         return response('ok', genAssets(fileIdList.length), 'Mock: 获取成功');
      },
   },
   {
      url: AssetApi.ADMIN_READ_FILE,
      method: GET,
      response: () => {
         return response('ok', mock('@cparagraph'), 'Mock: 获取成功');
      },
   },
];
