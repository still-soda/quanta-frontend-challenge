import { applyDecorators, HttpStatus, SetMetadata } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { responseSchema } from '../../utils/http-response.utils';

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
 * - `required` 是否必须，默认为 `true`
 * - `level` 最低权限要求，默认为 `ROLE.USER`
 **/
export const ApiNeedAuth = (options?: { required?: boolean; level?: ROLE }) => {
  const required = options?.required === undefined ? true : options.required;
  const level = options?.level ?? ROLE.USER;
  const levelStr =
    level === ROLE.USER
      ? '普通用户'
      : level === ROLE.ADMIN
        ? '管理员'
        : '超级管理员';

  return applyDecorators(
    ...[
      ApiHeader({
        name: 'authorization',
        description: `身份验证令牌，${levelStr}及以上权限可访问`,
        required: options?.required ?? true,
      }),
      required
        ? ApiResponse({
            status: HttpStatus.UNAUTHORIZED,
            description: '需要身份令牌 / 无效的身份令牌',
            schema: responseSchema(
              'unauthorized',
              '需要身份令牌 / 无效的身份令牌',
            ),
          })
        : undefined,
      required && level > ROLE.ADMIN
        ? ApiResponse({
            status: HttpStatus.FORBIDDEN,
            description: '权限不足',
            schema: responseSchema('forbidden', '权限不足'),
          })
        : undefined,
    ].filter(Boolean),
  );
};
