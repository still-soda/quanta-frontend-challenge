import { Action } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

/**
 * 获取我的动态
 * @api /actions/my-action
 * @returns 我的动态
 */
export async function getMyActions() {
   return get<RequestResult<Action[]>>('/actions/my-action');
}

export async function getActionById(id: string) {
   return get<RequestResult<Action>>(`/actions/one-action`, {
      query: { id },
   });
}
