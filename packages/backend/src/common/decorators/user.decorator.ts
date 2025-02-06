import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 用户信息接口，用于被 `@Auth()` 装饰器标记的路由。
 *
 * 当用户验证成功后，验证守卫会将用户信息存储在请求中，可由 `@CurrentUser()` 注入。
 *
 * - `username` 用户名
 * - `id` 用户 ID
 */
export interface UserData {
  username: string;
  id: string;
}

/**
 * 注入当前用户信息，要求配合 `@Auth()` 使用。
 */
export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
