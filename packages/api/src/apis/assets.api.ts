import { Asset } from '../models';
import { RequestResult } from '../utils/request.types';
import { post } from '../utils/request.utils';

/**
 * 获取静态文件元数据
 * @param fileIdList 文件id列表
 */
export async function getStaticFileMetadata(fileIdList: string[]) {
   return post<RequestResult<Asset[]>>('/assets/static-metadata', {
      body: JSON.stringify({ fileIdList }),
      headers: { 'Content-Type': 'application/json' },
   });
}
