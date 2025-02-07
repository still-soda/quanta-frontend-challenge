import { SetMetadata } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

/**
 * 用户角色
 * - `ROLE.USER`：普通用户
 * - `ROLE.ADMIN`：管理员
 * - `ROLE.SUPER_ADMIN`：超级管理员
 */
export enum ROLE {
  USER = 0,
  ADMIN = 1,
  SUPER_ADMIN = 2,
}

/**
 * 标记该接口需要认证，用于权限控制。
 *
 * `role` 用于指定访问该接口的最低权限要求，默认为 `ROLE.USER`。
 *
 * @param role 角色，默认为 `ROLE.USER`
 * - `ROLE.USER`：普通用户
 * - `ROLE.ADMIN`：管理员
 * - `ROLE.SUPER_ADMIN`：超级管理员
 */
export const Auth = (role: ROLE = ROLE.USER) =>
  SetMetadata('require-role', role);

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
