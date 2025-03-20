import { Tag } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

export enum TagApi {
   GET_ALL_TAGS = '/tags/find-all',
   GET_TAG_BY_ID = '/tags/find-one/',
   FIND_BY_IDS = '/tags/find-by-ids',
}

/**
 * 获取所有标签
 * @returns 所有标签
 */
export async function getAllTags() {
   return get<RequestResult<Tag[]>>(TagApi.GET_ALL_TAGS);
}

/**
 * 根据ID获取标签
 * @param id 标签ID
 * @return 单个标签
 */
export async function getTagById(id: string) {
   return get<RequestResult<Tag>>(`${TagApi.GET_TAG_BY_ID}${id}`);
}

/**
 * 根据多个 ID 返回标签列表
 * @param idList ID 列表
 * @returns 标签列表
 */
export async function findByIds(idList: string[]) {
   return get<RequestResult<Tag[]>>(TagApi.FIND_BY_IDS, {
      body: JSON.stringify({ id: idList }),
   });
}
