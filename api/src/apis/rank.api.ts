import { Rank } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

/**
 * 获取最近一次更新的全体排名
 */
export async function getRecentRank() {
   return get<RequestResult<Rank[]>>(`/rank/recent-rank`);
}

/**
 * 获取排名
 * @param history 历史排名
 * @param earliestRankCount 最早的排名
 */
export type MyHistoryRank = {
   history: Rank[];
   earliestRankCount: number;
};

/**
 * 获取我的历史排名
 */
export async function getMyHistoryRank() {
   return get<RequestResult<MyHistoryRank>>(`/rank/my-history`);
}

/**
 * 获取某个用户超越的百分比
 * @property lower 比自己分数低的人数
 * @property total 总人数
 * @property percent 超越的百分比
 */
export type GetOvercomingPercentResult = {
   lower: number;
   total: number;
   percent: number;
};

/**
 * 获取某个用户的历史排名
 * @param userId 用户ID
 */
export async function getOvercomingPercent() {
   return get<RequestResult<GetOvercomingPercentResult>>(
      `/rank/overcoming-percent`
   );
}

/**
 * 获取分数区间结果
 * @property min 最小分数
 * @property max 最大分数
 * @property count 人数
 */
export type GetScoreIntervalResult = {
   min: number;
   max: number;
   count: number;
};

/**
 * 获取分数区间
 */
export async function getScoreInterval() {
   return get<RequestResult<GetScoreIntervalResult>>(`/rank/score-interval`);
}
