import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  responseError,
  responseSuccess,
} from '../../utils/http-response.utils';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { AuthDoc } from './auth.doc';

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
  @AuthDoc.forRoute('/login')
  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto) {
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
  @AuthDoc.forRoute('/register')
  @HttpCode(200)
  @Post('register')
  async register(@Body() body: RegisterDto) {
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
   * - `forbidden` 无权限
   **/
  @AuthDoc.forRoute('/reset-password')
  @Auth()
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @CurrentUser() user: UserData,
  ) {
    const success = await this.authService.resetPassword(body, user.username);

    if (success) {
      return responseSuccess('ok', { success }, '重置成功');
    }

    throw responseError('not found', { msg: '用户不存在' });
  }
}
