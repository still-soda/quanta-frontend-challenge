import { Asset } from '../models';
import { RequestResult } from '../utils/request.types';
import { post } from '../utils/request.utils';

export enum AssetApi {
   GET_STATIC_FILE_METADATA = '/assets/static-metadata',
}

/**
 * 获取静态文件元数据
 * @param fileIdList 文件id列表
 */
export async function getStaticFileMetadata(fileIdList: string[]) {
   return post<RequestResult<Asset[]>>(AssetApi.GET_STATIC_FILE_METADATA, {
      body: JSON.stringify({ fileIdList }),
      headers: { 'Content-Type': 'application/json' },
   });
}
