import { useEventEmitter } from '@challenge/utils';
import {
   RequestErrorMsg,
   RequestOptions,
   RequestResultStatus,
} from './request.types';
import { getToken } from '../token';

/**
 * API 基础 URL
 */
export let BASE_URL = 'localhost:3000';

/**
 * 设置 API 基础 URL
 * @param url URL
 */
export function setBaseUrl(url: string) {
   BASE_URL = url;
}

/**
 * 拼接 Query 参数，构建 URL
 * @param baseUrl 基础 URL
 * @param query Query 参数
 * @returns URL
 */
const constructURL = (baseUrl: string, query: Map<string, any>): string => {
   const entries = Array.from(query.entries());

   let url = baseUrl;
   entries.length > 0 && (url += '?');
   url += entries.map(([key, value]) => `${key}=${value}`).join('&');

   return url;
};

/**
 * 发送请求
 * @param url 请求 URL
 * @param options 请求配置
 * @returns Promise
 */
export async function request(
   url: string,
   options: RequestOptions
): Promise<Response> {
   options.query && (url = constructURL(url, options.query));

   const token = getToken();
   options.headers = {
      ...options.headers,
      Authorization: token ?? '',
   };

   const response = await fetch(`${BASE_URL}${url}`, options)
      .then((response) => {
         if (!response.ok) {
            throw new Error(response.statusText);
         }
         return response;
      })
      .catch((err) => {
         // 向事件总线发射错误事件
         const eventEmitter = useEventEmitter();
         eventEmitter.emit(RequestResultStatus.ERROR, {
            url: `${BASE_URL}${url}`,
            options,
            response,
            error: err,
         } as RequestErrorMsg);
         throw err;
      });
   return response;
}

/**
 * 发送 GET 请求
 * @param url 请求 URL
 * @param options 请求配置
 * @returns Promise
 */
export async function get<T extends { [k: string]: string } = any>(
   url: string,
   options: RequestOptions = {}
): Promise<T> {
   return await request(url, {
      ...options,
      method: 'GET',
   }).then((res) => res.json());
}

/**
 * 发送 POST 请求
 * @param url 请求 URL
 * @param options 请求配置
 * @returns Promise
 */
export async function post<T extends { [k: string]: string } = any>(
   url: string,
   options: RequestOptions = {}
): Promise<T> {
   return await request(url, {
      ...options,
      method: 'POST',
   }).then((res) => res.json());
}

/**
 * 发送 PUT 请求
 * @param url 请求 URL
 * @param options 请求配置
 * @returns Promise
 */
export async function put<T extends { [k: string]: string } = any>(
   url: string,
   options: RequestOptions = {}
): Promise<T> {
   return await request(url, {
      ...options,
      method: 'PUT',
   }).then((res) => res.json());
}

/**
 * 发送 DELETE 请求
 * @param url 请求 URL
 * @param options 请求配置
 * @returns Promise
 */
export async function del<T extends { [k: string]: string } = any>(
   url: string,
   options: RequestOptions = {}
): Promise<T> {
   return await request(url, {
      ...options,
      method: 'DELETE',
   }).then((res) => res.json());
}
