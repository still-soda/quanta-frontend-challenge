import { Action } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

export enum ActionApi {
   GET_MY_ACTIONS = '/actions/my-action',
   GET_ACTION_BY_ID = '/actions/one-action',
}

/**
 * 获取我的动态
 * @api /actions/my-action
 * @returns 我的动态
 */
export async function getMyActions() {
   return get<RequestResult<Action[]>>(ActionApi.GET_MY_ACTIONS);
}

/**
 * 获取动态详情
 * @api /actions/one-action
 * @param id 动态 id
 * @returns 动态详情
 */
export async function getActionById(id: string) {
   return get<RequestResult<Action>>(ActionApi.GET_ACTION_BY_ID, {
      query: { id },
   });
}
