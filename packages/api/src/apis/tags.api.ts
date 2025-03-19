import { Tag } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

/**
 * 获取所有标签
 * @returns 所有标签
 */
export async function getAllTags() {
   return get<RequestResult<Tag[]>>('/tags/find-all');
}

/**
 * 根据ID获取标签
 * @param id 标签ID
 * @return 单个标签
 */
export async function getTagById(id: string) {
   return get<RequestResult<Tag>>(`/tags/find-one/${id}`);
}

/**
 * 根据多个 ID 返回标签列表
 * @param idList ID 列表
 * @returns 标签列表
 */
export async function findByIds(idList: string[]) {
   return get<RequestResult<Tag[]>>('/tags/find-by-ids', {
      body: JSON.stringify({ id: idList }),
   });
}
