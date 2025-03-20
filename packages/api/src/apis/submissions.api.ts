import { Submission } from '../models';
import { RequestResult } from '../utils/request.types';
import { get } from '../utils/request.utils';

export enum SubmissionApi {
   GET_MY_SUBMISSIONS = '/submissions/my-submissions',
   GET_SUBMISSION_BY_ID = '/submissions/one-submission',
   GET_SUBMIT_COUNT_OF_CHALLENGE = '/submissions/count',
   GET_CHALLENGE_PASSED_RATE = '/submissions/passed-rate',
   GET_MY_SUBMISSIONS_IN_CHALLENGE = '/submissions/my-submissions-in-challenge',
   GET_MAX_CORRECT_RATE = '/submissions/max-correct-rate',
   GET_MY_RECENT_SUBMISSION = '/submissions/my-recent-submission',
}

/**
 * 获取我的提交
 * @api /submissions/my-submissions
 * @returns 我的提交列表
 */
export async function getMySubmissions() {
   return await get<RequestResult<Submission[]>>(
      SubmissionApi.GET_MY_SUBMISSIONS
   );
}

/**
 * 根据提交id获取提交详情
 * @api /submissions/one-submission
 * @param submissionId 提交id
 * @returns 提交详情
 */
export async function getSubmissionById(submissionId: string) {
   return await get<RequestResult<Submission>>(
      SubmissionApi.GET_SUBMISSION_BY_ID,
      { query: { submissionId } }
   );
}

/**
 * 获取挑战的提交次数
 * @api /submissions/count
 * @param challengeId 挑战id
 * @returns 提交次数
 */
export async function getSubmitCountOfChallenge(challengeId: string) {
   return await get<RequestResult<{ count: number }>>(
      SubmissionApi.GET_SUBMIT_COUNT_OF_CHALLENGE,
      { query: { challengeId } }
   );
}

/**
 * 获取某个挑战的提交数量的响应
 * @property total 提交总数
 * @property passed 通过的提交数
 * @property rate 通过率
 */
export type GetChallengesPassRateResponse = {
   rate: number;
   total: number;
   passed: number;
};

/**
 * 获取挑战通过率
 * @api /submissions/passed-rate
 * @param challengeId 挑战id
 * @returns 通过率
 */
export async function getChallengePassedRate(challengeId: string) {
   return await get<RequestResult<GetChallengesPassRateResponse>>(
      SubmissionApi.GET_CHALLENGE_PASSED_RATE,
      { query: { challengeId } }
   );
}

/**
 * 获取我的挑战提交
 * @api /submissions/my-submissions-in-challenge
 * @param challengeId 挑战id
 * @returns 我的挑战提交
 */
export async function getMySubmissionsInChallenge(challengeId: string) {
   return await get<RequestResult<Submission[]>>(
      SubmissionApi.GET_MY_SUBMISSIONS_IN_CHALLENGE,
      { query: { challengeId } }
   );
}

/**
 * 获取挑战的最大通过率
 * @api /submissions/max-correct-rate
 * @param challengeId 挑战id
 * @returns 最大通过率
 */
export async function getMaxCorrectRate(challengeId: string) {
   return get<RequestResult<number>>(SubmissionApi.GET_MAX_CORRECT_RATE, {
      query: { challengeId },
   });
}

/**
 * 获取我的最近提交
 * @api /submissions/my-recent-submission
 * @returns 我的最近提交
 */
export async function getMyRecentSubmission() {
   return get<RequestResult<Submission>>(
      SubmissionApi.GET_MY_RECENT_SUBMISSION
   );
}
