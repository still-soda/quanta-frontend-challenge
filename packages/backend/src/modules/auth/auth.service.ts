import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Role, UsersDocument } from 'src/schemas/users.schema';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { responseError } from '../../utils/http-response.utils';
import validateData from '../../utils/validate-data.utils';

type LoginResult = Promise<string | number>;

@Injectable()
export class AuthService {
  private readonly PBKDF2_ITERATIONS = Number(
    this.configService.getOrThrow('PBKDF2_ITERATIONS'),
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 加盐加密用户密码，返回加密后的密码和盐。
   *
   * 该函数是私有的，不应该暴露给外部。
   *
   * @param password 用户密码
   * @returns
   * - `salt`: 加密时使用的盐
   * - `hash`: 加密后的密码
   */
  private encryptPassword(password: string): {
    salt: string;
    hash: string;
  } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, this.PBKDF2_ITERATIONS, 64, 'sha256')
      .toString('hex');
    return { salt, hash };
  }

  /**
   * 验证用户密码是否正确。
   *
   * 该函数是私有的，不应该暴露给外部。
   *
   * @param hash 加密后的密码
   * @param salt 加密时使用的盐
   * @param password 用户密码
   * @returns 是否正确
   */
  private validatePassword(
    hash: string,
    salt: string,
    password: string,
  ): boolean {
    const receivedHash = crypto
      .pbkdf2Sync(password, salt, this.PBKDF2_ITERATIONS, 64, 'sha256')
      .toString('hex');
    return receivedHash === hash;
  }

  /**
   * 生成 Token。
   *
   * 该函数是私有的，不应该暴露给外部。
   *
   * @param user 用户信息
   * @returns Token
   */
  private generateToken(user: UsersDocument): string {
    const { id, username, role } = user;
    return this.jwtService.sign({ id, username, role });
  }

  /**
   * 验证 Token。
   * @param token Token
   * @returns Token 解析后的信息
   * - `id`: 用户 ID
   * - `username`: 用户名
   * - `role`: 用户角色
   * @throws Token 无效时抛出异常
   */
  verifyToken(token: string) {
    return this.jwtService.verify<{
      id: string;
      username: string;
      role: Role;
    }>(token);
  }

  /**
   * 用户登录。
   * @param dto 登录信息
   * - `username`: 用户名
   * - `password`: 用户密码
   * @returns 登录成功返回Token，否则：
   * - 用户不存在返回 `-1`
   * - 密码错误返回 `-2`
   * @throws
   * - `bad request` 请求参数错误
   */
  async login(dto: LoginDto): LoginResult {
    try {
      dto = await validateData(LoginDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { username, password } = dto;
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return -1;
    }
    const { salt, passwordHash } = user;
    if (this.validatePassword(passwordHash, salt, password)) {
      const token = this.generateToken(user);
      return token;
    }
    return -2;
  }

  /**
   * 用户注册，用户名不可重复。
   * @param dto 注册信息
   * - `username`: 用户名
   * - `password`: 用户密码
   * - `email`: 用户邮箱
   * - `number`: 用户学号
   * - `phone`: 用户手机号
   * @returns
   * - 注册成功返回 Token
   * - 用户名重复返回 `-1`
   * @throws
   * - `bad request` 请求参数错误
   **/
  async register(dto: RegisterDto): Promise<string | number> {
    try {
      dto = await validateData(RegisterDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { username, password, email, number, phone } = dto;

    const userExist = await this.usersService.findOneByUsername(username);
    if (userExist) {
      return -1;
    }

    const { salt, hash: passwordHash } = this.encryptPassword(password);
    const user = await this.usersService.create({
      passwordHash,
      username,
      number,
      phone,
      salt,
      email,
    });

    const token = this.generateToken(user);
    return token;
  }

  /**
   * 忘记密码，重置密码。
   * @param dto 重置密码信息
   * - `username`: 用户名
   * - `newPassword`: 新密码
   * @returns
   * - 重置成功返回 `true`
   * - 重置失败返回 `false`，原因是用户名不存在
   * @throws
   * - `bad request` 请求参数错误
   * - `forbidden` 无权限
   */
  async resetPassword(dto: ResetPasswordDto, receivedName: string) {
    try {
      dto = await validateData(ResetPasswordDto, dto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    if (receivedName !== dto.username) {
      throw responseError('forbidden', { msg: '无权限' });
    }

    const { username, newPassword } = dto;
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return false;
    }

    const { salt, hash: passwordHash } = this.encryptPassword(newPassword);
    await this.usersService.update(user.id, { passwordHash, salt });
    return true;
  }
}
