/**
 * 判题记录数据
 * @property success 判题是否成功
 * @property type 判题类型
 * @property text 判题结果文本
 * @property score 判题得分
 * @property screenshot 截图
 */
export interface RecordData {
   success: boolean;
   type: 'action' | 'testpoint';
   text: string;
   score: number;
   screenshot?: string;
}
