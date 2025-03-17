import { Asset } from '@/models/asset.model';
import { RequestResult } from '@/types/request';
import { post } from '@challenge/api';

/**
 * 获取静态文件元数据
 * @param fileIds 文件id列表
 */
export async function getStaticFileMetadata(fileIds: string[]) {
   return post<RequestResult<Asset>>('/assets/static-metadata', {
      body: JSON.stringify({ fileIds }),
      headers: { 'Content-Type': 'application/json' },
   });
}
