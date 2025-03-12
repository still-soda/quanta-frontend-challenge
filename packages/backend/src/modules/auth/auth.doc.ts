import { HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

class RegisterWithCaptchaDto extends RegisterDto {
  @ApiProperty({
    description: '验证码',
    required: true,
    example: '1234',
  })
  captcha: string;

  @ApiProperty({
    description: '验证码ID',
    required: true,
    example: '1234',
  })
  captchaId: string;
}

export const AuthDoc = new ApiDocumentHelper({
  '/login': () => {
    return [
      ApiOperation({ summary: '用户登录' }),
      ApiBody({ type: LoginDto }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '成功登录',
        schema: responseSchema('ok', '登录成功', {
          type: 'object',
          properties: { token: { type: 'string', description: '令牌' } },
        }),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '用户不存在',
        schema: responseSchema('not found', '用户不存在'),
      }),
      ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: '密码错误',
        schema: responseSchema('unauthorized', '密码错误'),
      }),
    ];
  },
  '/register': () => {
    return [
      ApiOperation({ summary: '用户注册' }),
      ApiBody({ type: RegisterWithCaptchaDto }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '注册成功',
        schema: responseSchema('ok', '注册成功', {
          type: 'object',
          properties: { token: { type: 'string', description: '令牌' } },
        }),
      }),
      ApiResponse({
        status: HttpStatus.CONFLICT,
        description: '用户名重复',
        schema: responseSchema('conflict', '用户名重复'),
      }),
    ];
  },
  '/reset-password': () => {
    return [
      ApiOperation({ summary: '重置密码' }),
      ApiBody({ type: ResetPasswordDto }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '重置成功',
        schema: responseSchema('ok', '重置成功', {
          type: 'object',
          properties: { success: { type: 'boolean', description: '是否成功' } },
        }),
      }),
      ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: '用户不存在',
        schema: responseSchema('not found', '用户不存在'),
      }),
      ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: '无权限',
        schema: responseSchema('forbidden', '无权限'),
      }),
    ];
  },
  '/captcha': () => {
    return [
      ApiOperation({ summary: '获取验证码' }),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: {
            id: { type: 'string', description: '验证码ID' },
            svg: { type: 'string', description: 'SVG格式的验证码' },
          },
        }),
      }),
    ];
  },
});
