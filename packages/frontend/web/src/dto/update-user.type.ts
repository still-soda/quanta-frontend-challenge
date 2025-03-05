/**
 * User更新类型
 * @property number 学号
 * @property email 邮箱
 * @property phone 手机号
 * @property signature 个性签名
 */
export type UpdateUserPayload = {
   number?: number;
   email?: string;
   phone?: string;
   signature?: string;
};
