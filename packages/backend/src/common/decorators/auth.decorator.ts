import { SetMetadata } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

/**
 * 标记该接口需要认证。
 */
export const Auth = () => SetMetadata('require-auth', true);

/**
 * 标记该接口需要在请求头中携带验证消息，用于 Swagger 文档。
 * @param options 可选配置项
 * - require 是否必须，默认为 true
 **/
export const ApiNeedAuth = (options?: { require: boolean }) =>
  ApiHeader({
    name: 'authorization',
    description: '身份验证令牌',
    required: options?.require ?? true,
  });
