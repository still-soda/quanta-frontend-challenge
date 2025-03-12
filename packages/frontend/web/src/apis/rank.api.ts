import { Rank } from '@/models/rank.model';
import { RequestResult } from '@/types/request';
import { get } from '@challenge/api';

/**
 * 获取最近一次更新的全体排名
 */
export async function getRecentRank() {
   return get<RequestResult<Rank[]>>(`/rank/recent-rank`);
}

export async function getMyHistoryRank() {
   return get<RequestResult<Rank[]>>(`/rank/my-history`);
}
