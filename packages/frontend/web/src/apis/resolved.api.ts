import { ResolvedChallenge } from '@/models/resolved-challenge.model';
import { RequestResult } from '@/types/request';
import { get } from '@challenge/api';

/**
 * 获取最早的三个已解决挑战
 * @api /resolved-challenge/earliest-three-of-challenge
 * @returns 最早的三个已解决挑战
 */
export async function getEarliestThreeResolvedChallenges() {
   return get<RequestResult<ResolvedChallenge[]>>(
      '/resolved-challenge/earliest-three-of-challenge'
   );
}

/**
 * 获取用户最早的已解决挑战
 * @api /resolved-challenge/earliest-three-of-user
 * @returns 用户最早的已解决挑战
 */
export async function getEarlisetResolvedChallengesOfUser(userId: string) {
   return get<RequestResult<ResolvedChallenge[]>>(
      '/resolved-challenge/earliest-of-user',
      { query: { userId } }
   );
}
