/**
 * 挑战数据
 * @property id - 挑战ID
 * @property title - 挑战标题
 * @property difficulty - 挑战难度
 * @property score - 挑战分数
 * @property type - 挑战类型
 * @property tags - 挑战标签
 */
export type Challenge = {
   id: string;
   title: string;
   difficulty: string;
   score: number;
   type: string;
   tags: string[];
};
