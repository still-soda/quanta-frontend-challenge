import { Tag } from './tag.model';

/**
 * 挑战数据
 * @property id - 挑战ID
 * @property title - 挑战标题
 * @property difficulty - 挑战难度
 * @property score - 挑战分数
 * @property type - 挑战类型
 * @property tags - 挑战标签
 * @property authorId - 作者ID
 * @property totalSubmissions - 总提交数
 * @property totalPass - 总通过数
 * @property updatedAt - 更新时间
 * @property createdAt - 创建时间
 */
export interface Challenge {
   id: string;
   title: string;
   difficulty: string;
   score: number;
   type: string;
   tags: Tag[];
   authorId: string;
   totalSubmissions: number;
   totalPass: number;
   updatedAt: string;
   createdAt: string;
}

/**
 * 最新的挑战
 * @extends Challenge
 * @property content - 挑战内容
 */
export interface LatestChallenge extends Challenge {
   content: string;
}

/**
 * 挑战状态
 * @enum
 * 1. PENDING: 待审核
 * 2. READY: 准备中
 * 3. PUBLISHED: 已发布
 * 4. CLOSED: 已关闭
 */
export enum ChallengeStatus {
   PENDING = 0,
   READY = 1,
   PUBLISHED = 2,
   CLOSED = 3,
}

/**
 * 完整的挑战
 * @extends Challenge
 * @property status - 挑战状态
 * - 0: 待审核
 * - 1: 准备中
 * - 2: 已发布
 * - 3: 已关闭
 * @property contentId - 内容ID
 * @property flowdataId - 流程数据ID
 * @property standardAnswer - 标准答案
 * @property answerTemplate - 答案模板
 * @property screenshots - 截图
 * @property fastestSolvers - 最快解答者
 */
export interface IntegralChallenge extends Challenge {
   status: ChallengeStatus;
   contentId: string;
   flowdataId?: string;
   standardAnswer: string[];
   answerTemplate: string[];
   screenshots: string[];
   fastestSolvers: string[];
}
