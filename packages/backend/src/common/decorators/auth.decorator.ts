import { SetMetadata } from '@nestjs/common';

/**
 * 标记该接口需要认证。
 */
export const Auth = () => SetMetadata('require-auth', true);
