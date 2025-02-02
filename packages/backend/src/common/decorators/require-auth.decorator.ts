import { SetMetadata } from '@nestjs/common';

/**
 * 标记该接口需要认证。
 */
export const RequireAuth = () => SetMetadata('require-auth', true);
