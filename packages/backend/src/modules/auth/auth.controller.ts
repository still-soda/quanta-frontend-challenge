import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import validateData from '../../utils/validate-data.utils';
import { LoginDto } from './dto/login.dto';
import {
  HttpResponseSchema,
  responseError,
  responseSuccess,
} from '../../utils/http-response.utils';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface LoginBody {
  username: string;
  password: string;
}

interface RegisterBody {
  username: string;
  password: string;
  email: string;
  number: string;
  phone: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功登录',
    type: HttpResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
    type: HttpResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '密码错误',
    type: HttpResponseSchema,
  })
  async login(@Body() body: LoginDto) {
    try {
      body = await validateData(LoginDto, body);
    } catch (error) {
      throw responseError('bad request', error.message);
    }

    const token = await this.authService.login(body);

    if (typeof token === 'string') {
      return responseSuccess('ok', { token });
    }
    if (token === -1) {
      throw responseError('not found', { msg: '用户不存在' });
    }
    throw responseError('unauthorized', { msg: '密码错误' });
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
    type: HttpResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '用户名重复',
    type: HttpResponseSchema,
  })
  async register(@Body() body: RegisterBody) {
    try {
      body = await validateData(RegisterDto, body);
    } catch (error) {
      throw responseError('bad request', error.message);
    }

    const token = await this.authService.register(body);

    if (typeof token === 'string') {
      return responseSuccess('ok', { token });
    }
    throw responseError('conflict', { msg: '用户名重复' });
  }

  @Post('reset-password')
  @ApiOperation({ summary: '重置密码' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '重置成功',
    type: HttpResponseSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
    type: HttpResponseSchema,
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      body = await validateData(ResetPasswordDto, body);
    } catch (error) {
      throw responseError('bad request', error.message);
    }

    const success = await this.authService.resetPassword(body);

    if (success) {
      return responseSuccess('ok', { success });
    }
    throw responseError('not found', { msg: '用户不存在' });
  }
}
