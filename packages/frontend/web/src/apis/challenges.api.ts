import { Challenge } from '@/models/challenge.model';
import { RequestResult } from '@/types/request';
import { get, post } from '@challenge/api';

/**
 * 获取所有已发布的挑战
 * @api /challenges/find-all
 * @returns 挑战列表
 */
export async function getAllPublishedChallenges() {
   return get<RequestResult<Challenge[]>>('/challenges/find-all');
}

/**
 * 获取挑战详情（内容）
 * @api /challenges/detail/:challengeId
 * @param challengeId 挑战 ID
 * @returns 挑战详情
 */
export async function getChallengeDetail(challengeId: string) {
   return get<RequestResult<string>>(`/challenges/detail/${challengeId}`);
}

/**
 * 获取挑战作答模板下载链接
 * @api /challenges/download-answer-template
 * @param challengeId 挑战 ID
 * @returns 作答模板下载链接
 */
export async function getDownloadUrlOfAnswerTemplate(challengeId: string) {
   return get<RequestResult<string[]>>(`/challenges/download-answer-template`, {
      query: { challengeId },
   });
}

/**
 * 获取最新发布的挑战
 * @api /challenges/get-latest-challenges
 * @returns 最新的挑战
 */
export async function getLastestChallenges() {
   return get<RequestResult<Challenge[]>>('/challenges/get-latest-challenges');
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
   return post<RequestResult<undefined>>('/challenges/upload-answer', {
      body: formData,
   });
}

/**
 * 根据ID获取挑战详情
 * @api /challenges/find-one
 * @param challengeId 挑战 ID
 * @returns 挑战详情
 */
export async function getChallengeById(challengeId: string) {
   return get<RequestResult<Challenge>>(`/challenges/find-one`, {
      query: { challengeId },
   });
}
