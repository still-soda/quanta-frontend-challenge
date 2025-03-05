/**
 * User 数据模型
 * @property username 用户名
 * @property email 邮箱
 * @property id 用户id
 * @property avatar 用户头像
 * @property signature 个性签名
 * @property totalSubmissions 总提交次数
 */
export type User = {
   username: string;
   id: string;
   avatar: string;
   email: string;
   signature: string;
   totalSubmissions: number;
};
