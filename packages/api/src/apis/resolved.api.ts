import { ResolvedChallenge } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

export enum ResolvedChallengeApi {
   GET_EARLIEST_THREE_OF_CHALLENGE = '/resolved-challenge/earliest-three-of-challenge',
   GET_EARLIEST_THREE_OF_USER = '/resolved-challenge/earliest-of-user',
}

/**
 * 获取最早的三个已解决挑战
 * @api /resolved-challenge/earliest-three-of-challenge
 * @returns 最早的三个已解决挑战
 */
export async function getEarliestThreeResolvedChallenges() {
   return get<RequestResult<ResolvedChallenge[]>>(
      ResolvedChallengeApi.GET_EARLIEST_THREE_OF_CHALLENGE
   );
}

/**
 * 获取用户最早的已解决挑战
 * @api /resolved-challenge/earliest-three-of-user
 * @returns 用户最早的已解决挑战
 */
export async function getEarlisetResolvedChallengesOfUser(userId: string) {
   return get<RequestResult<ResolvedChallenge[]>>(
      ResolvedChallengeApi.GET_EARLIEST_THREE_OF_USER,
      { query: { userId } }
   );
}
