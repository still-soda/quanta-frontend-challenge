import { HttpException } from '@nestjs/common';

export const HTTP_RESPONSE_TYPES = [
  { code: 200, message: 'ok' },
  { code: 400, message: 'bad request' },
  { code: 401, message: 'unauthorized' },
  { code: 403, message: 'forbidden' },
  { code: 404, message: 'not found' },
  { code: 500, message: 'internal server error' },
  { code: 502, message: 'bad gateway' },
  { code: 201, message: 'created' },
  { code: 202, message: 'accepted' },
  { code: 204, message: 'no content' },
  { code: 301, message: 'moved permanently' },
  { code: 302, message: 'found' },
  { code: 303, message: 'see other' },
  { code: 304, message: 'not modified' },
  { code: 307, message: 'temporary redirect' },
  { code: 308, message: 'permanent redirect' },
  { code: 405, message: 'method not allowed' },
  { code: 406, message: 'not acceptable' },
  { code: 407, message: 'proxy authentication required' },
  { code: 408, message: 'request timeout' },
  { code: 409, message: 'conflict' },
  { code: 410, message: 'gone' },
  { code: 411, message: 'length required' },
  { code: 412, message: 'precondition failed' },
  { code: 413, message: 'payload too large' },
  { code: 414, message: 'uri too long' },
  { code: 415, message: 'unsupported media type' },
  { code: 416, message: 'range not satisfiable' },
  { code: 417, message: 'expectation failed' },
  { code: 426, message: 'upgrade required' },
  { code: 429, message: 'too many requests' },
  { code: 431, message: 'request header fields too large' },
  { code: 451, message: 'unavailable for legal reasons' },
  { code: 503, message: 'service unavailable' },
  { code: 504, message: 'gateway timeout' },
  { code: 505, message: 'http version not supported' },
] as const;

export const type2code = HTTP_RESPONSE_TYPES.reduce(
  (acc, cur) => ({ ...acc, [cur.message]: cur.code }),
  {} as Record<HttpResponseMessage, HttpResponseCode>,
);

export type HttpResponseTypes = (typeof HTTP_RESPONSE_TYPES)[number];

export type HttpResponseCode = HttpResponseTypes['code'];

export type HttpResponseMessage = HttpResponseTypes['message'];

/**
 * 获取成功响应。
 * @param type 响应类型
 * @param data 数据
 * @param msg 消息，如果缺省则默认为响应类型
 * @returns
 * - `code`: 状态码
 * - `data`: 数据
 * - `message`: 消息
 */
export function responseSuccess<T = any>(
  type: HttpResponseMessage,
  data: T,
  msg?: string,
) {
  return {
    code: type2code[type],
    message: msg ?? type,
    data,
  };
}

/**
 * 获取错误响应，并返回异常。
 * @param type 响应类型
 * @param options 日志选项
 * - `msg`: 消息
 * - `withoutStack`: 是否不记录堆栈信息，默认不记录
 * @returns 状态对应的异常，**需要在控制器中抛出**
 */
export function responseError(
  type: HttpResponseMessage,
  options: {
    msg?: string;
    withoutStack?: boolean;
  },
) {
  const { msg, withoutStack = true } = options;
  const payload = {
    code: type2code[type],
    message: msg ?? type,
    __without_stack__: withoutStack,
  };
  return new HttpException(payload, payload.code);
}

/**
 * 工具函数，构造并返回响应的 JSON Schema，用于 Swagger 文档。
 * @param type 响应类型
 * @param msg 消息
 * @param data 数据
 * - `type`: 数据类型
 * - `schema`: 数据结构
 * - `example`: 示例
 * - `properties`: 属性
 * @returns JSON Schema
 */
export function responseSchema(
  type: HttpResponseMessage,
  msg?: string,
  data?: {
    type?: any;
    schema?: any;
    example?: any;
    properties?: any;
    items?: any;
  },
) {
  return {
    type: 'object',
    properties: {
      message: { type: 'string', example: msg ?? type },
      code: { type: 'number', example: type2code[type] },
      data,
    },
  };
}
