/**
 * 解决的挑战
 * @property id - ID
 * @property challengeId - 挑战ID
 * @property userId - 用户ID
 * @property resolvedAt - 解决时间
 * @property solution - 解决用时
 * @property rank - 解决排名
 */
export type ResolvedChallenge = {
   id: string;
   challengeId: string;
   userId: string;
   resolvedAt: string;
   solution: number;
   rank: number;
};
