/**
 * 活动数据
 * @property title 活动标题
 * @property type 活动类型
 * @property payload 活动数据
 * @property userId 用户id
 */
export interface Action {
   title: string;
   type: string;
   payload: any;
   userId: string;
}
