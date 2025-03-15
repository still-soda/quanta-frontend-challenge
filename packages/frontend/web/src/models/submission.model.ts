/**
 * 提交状态
 */
export type SubmissionStatus = 'pending' | 'passed' | 'failed';

/**
 * 提交数据
 * @property challengeId - 挑战ID
 * @property userId - 用户ID
 * @property type - 类型
 * @property score - 得分
 * @property correctRate - 正确率
 * @property status - 状态
 * @property message - 消息
 * @property createdAt - 创建时间
 * @property updatedAt - 更新时间
 */
export type Submission = {
   challengeId: string;
   userId: string;
   type: string;
   score: number;
   correctRate: number;
   status: SubmissionStatus;
   message: string;
   createdAt: string;
   updatedAt: string;
};
