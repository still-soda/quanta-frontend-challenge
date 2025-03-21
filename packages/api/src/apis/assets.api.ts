import { Asset } from '../models';
import { RequestResult } from '../utils/request.types';
import { get, post } from '../utils/request.utils';

export enum AssetApi {
   GET_STATIC_FILE_METADATA = '/assets/static-metadata',
   ADMIN_READ_FILE = '/assets/read-one/',
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

/**
 * 管理员读取非静态文件
 * @param fileId 文件id
 */
export async function adminReadFile(fileId: string) {
   return get<RequestResult<string>>(AssetApi.ADMIN_READ_FILE + fileId);
}
