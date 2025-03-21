import { IntegralChallenge, Challenge, LatestChallenge } from '../models';
import { RequestResult } from '../utils/request.types';
import { get, post } from '../utils/request.utils';

export enum ChallengeApi {
   GET_ALL_PUBLISHED_CHALLENGES = '/challenges/find-all',
   GET_CHALLENGE_DETAIL = '/challenges/detail/',
   GET_DOWNLOAD_URL_OF_ANSWER_TEMPLATE = '/challenges/download-answer-template',
   GET_LASTEST_CHALLENGES = '/challenges/get-latest-challenges',
   UPLOAD_ANSWER = '/challenges/upload-answer',
   GET_CHALLENGE_BY_ID = '/challenges/find-one',
   GET_CHALLENGES_TOTAL_SCORE = '/challenges/total-score',
   ADMIN_GET_ALL_CHALLENGES = '/challenges/admin-find-all',
   ADMIN_GET_CHALLENGE_DETAIL = '/challenges/admin-detail/',
}

/**
 * 获取所有已发布的挑战
 * @api /challenges/find-all
 * @returns 挑战列表
 */
export async function getAllPublishedChallenges(options?: {
   include?: string[];
   all?: string[];
}) {
   return get<RequestResult<Challenge[]>>(ChallengeApi.GET_LASTEST_CHALLENGES, {
      query: options,
   });
}

/**
 * 获取挑战详情（内容）
 * @api /challenges/detail/:challengeId
 * @param challengeId 挑战 ID
 * @returns 挑战详情
 */
export async function getChallengeDetail(challengeId: string) {
   return get<RequestResult<string>>(
      `${ChallengeApi.GET_CHALLENGE_DETAIL}${challengeId}`
   );
}

/**
 * 获取挑战作答模板下载链接
 * @api /challenges/download-answer-template
 * @param challengeId 挑战 ID
 * @returns 作答模板下载链接
 */
export async function getDownloadUrlOfAnswerTemplate(challengeId: string) {
   return get<RequestResult<string[]>>(
      ChallengeApi.GET_DOWNLOAD_URL_OF_ANSWER_TEMPLATE,
      { query: { challengeId } }
   );
}

/**
 * 获取最新发布的挑战
 * @api /challenges/get-latest-challenges
 * @returns 最新的挑战
 */
export async function getLastestChallenges() {
   return get<RequestResult<LatestChallenge[]>>(
      ChallengeApi.GET_LASTEST_CHALLENGES
   );
}

/**
 * 上传挑战作答
 * @api /challenges/upload-answer
 * @param files 作答文件
 * @returns 上传结果
 */
export async function uploadAnswer(files: File[]) {
   const formData = new FormData();
   files.forEach((file) => formData.append('files', file));
   return post<RequestResult<string[]>>(ChallengeApi.UPLOAD_ANSWER, {
      body: formData,
   });
}

/**
 * 根据ID获取挑战详情
 * @api /challenges/find-one
 * @param id 挑战 ID
 * @returns 挑战详情
 */
export async function getChallengeById(id: string) {
   return get<RequestResult<Challenge>>(ChallengeApi.GET_CHALLENGE_BY_ID, {
      query: { id },
   });
}

/**
 * 获取挑战总分
 * @api /challenges/total-score
 * @returns 挑战总分
 */
export async function getChallengesTotalScore() {
   return get<RequestResult<number>>(ChallengeApi.GET_CHALLENGES_TOTAL_SCORE);
}

/**
 * 管理员获取已发布挑战和自己的挑战，超级管理员获取所有挑战
 * @returns 全部挑战
 */
export async function adminGetAllChallenges() {
   return get<RequestResult<IntegralChallenge[]>>(
      ChallengeApi.ADMIN_GET_ALL_CHALLENGES
   );
}

/**
 * 管理员获取挑战详情
 * @api /challenges/admin-detail/:challengeId
 * @param challengeId 挑战 ID
 * @returns 挑战详情
 */
export async function adminGetChallengeDetail(challengeId: string) {
   return get<RequestResult<string>>(
      `${ChallengeApi.ADMIN_GET_CHALLENGE_DETAIL}${challengeId}`
   );
}
