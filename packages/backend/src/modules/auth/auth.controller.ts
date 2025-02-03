import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import validateData from '../../utils/validate-data.utils';
import { LoginDto } from './dto/login.dto';
import {
  responseError,
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录控制器，接收用户登录信息，返回登录结果。
   * @param body
   * - `username` 用户名
   * - `password` 密码
   * @throws
   * - `bad request` 请求参数错误
   * - `not found` 用户不存在
   * - `unauthorized` 密码错误
   */
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功登录',
    schema: responseSchema('ok', '登录成功', {
      type: 'object',
      properties: { token: { type: 'string', description: '令牌' } },
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
    schema: responseSchema('not found', '用户不存在'),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '密码错误',
    schema: responseSchema('unauthorized', '密码错误'),
  })
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      body = await validateData(LoginDto, body);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const token = await this.authService.login(body);

    if (typeof token === 'string') {
      return responseSuccess('ok', { token }, '登录成功');
    }
    if (token === -1) {
      throw responseError('not found', { msg: '用户不存在' });
    }
    throw responseError('unauthorized', { msg: '密码错误' });
  }

  /**
   * 用户注册控制器，接收用户注册信息，返回注册结果。
   * @param body
   * - `username` 用户名
   * - `password` 密码
   * - `email` 邮箱
   * - `number` 学号
   * - `phone` 手机号
   * @throws
   * - `bad request` 请求参数错误
   * - `conflict` 用户名重复
   **/
  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
    schema: responseSchema('ok', '注册成功', {
      type: 'object',
      properties: { token: { type: 'string', description: '令牌' } },
    }),
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '用户名重复',
    schema: responseSchema('conflict', '用户名重复'),
  })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      body = await validateData(RegisterDto, body);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const token = await this.authService.register(body);

    if (typeof token === 'string') {
      return responseSuccess('ok', { token }, '注册成功');
    }
    throw responseError('conflict', { msg: '用户名重复' });
  }

  /**
   * 重置密码控制器，接收重置密码信息，返回重置结果。
   * @param body
   * - `username` 用户名
   * - `password` 密码
   * @throws
   * - `bad request` 请求参数错误
   * - `not found` 用户不存在
   **/
  @ApiOperation({ summary: '重置密码' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '重置成功',
    schema: responseSchema('ok', '重置成功', {
      type: 'object',
      properties: { success: { type: 'boolean', description: '是否成功' } },
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
    schema: responseSchema('not found', '用户不存在'),
  })
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      body = await validateData(ResetPasswordDto, body);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const success = await this.authService.resetPassword(body);

    if (success) {
      return responseSuccess('ok', { success });
    }
    throw responseError('not found', { msg: '用户不存在' });
  }
}
