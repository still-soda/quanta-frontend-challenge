import { Action } from '@/models/action.model';
import { RequestResult } from '@/types/request';
import { get } from '@challenge/api';

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
