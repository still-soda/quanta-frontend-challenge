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
