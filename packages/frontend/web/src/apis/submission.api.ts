import { Submission } from '@/models/submission.model';
import { RequestResult } from '@/types/request';
import { get } from '@challenge/api';

/**
 * 获取我的提交
 * @api /submissions/my-submissions
 * @returns 我的提交列表
 */
export async function getMySubmissoins() {
   return await get<RequestResult<Submission[]>>('/submissions/my-submissions');
}

/**
 * 获取提交详情
 * @api /submissions/one-submission
 * @param submissionId 提交id
 * @returns 提交详情
 */
export async function getSubmissionById(submissionId: string) {
   return await get<RequestResult<Submission>>(`/submissions/one-submission`, {
      query: { submissionId },
   });
}

/**
 * 获取挑战提交次数
 * @api /submissions/count
 * @param challengeId 挑战id
 * @returns 提交次数
 */
export async function getSubmitCountOfChallenge(challengeId: string) {
   return await get<RequestResult<number>>(`/submissions/count`, {
      query: { challengeId },
   });
}

/**
 * 获取挑战通过率
 * @api /submissions/passed-rate
 * @param challengeId 挑战id
 * @returns 通过率
 */
export async function getChallengePassedRate(challengeId: string) {
   return await get<RequestResult<number>>(`/submissions/passed-rate`, {
      query: { challengeId },
   });
}
