export type RequestResult<Data = {}> = {
   /** 响应消息 */
   message: string;
   /** 响应状态码 */
   code: number;
   /** 响应数据 */
   data: Data;
};
