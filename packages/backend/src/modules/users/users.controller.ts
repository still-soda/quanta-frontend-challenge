import { Controller, Get, Post, Body, Query, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  responseError,
  responseSchema,
  responseSuccess,
} from 'src/utils/http-response.utils';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import {
  GuestGetUserDto,
  guestGetUserDtoProps,
} from './dto/guest-get-user.dto';
import { ApiNeedAuth, Auth } from 'src/common/decorators/auth.decorator';
import { UserInfo } from 'src/common/middlewares/auth.middleware';
import {
  OwnerGetUserDto,
  ownerGetUserDtoProps,
} from './dto/onwer-get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 根据用户ID或用户名查找用户信息，优先ID查找。
   * @param id 用户ID
   * @param username 用户名
   * @returns 查找到的用户
   * @throws
   * - `not found` 用户不存在
   * - `bad request` 请求参数错误
   */
  @ApiOperation({ summary: '根据用户ID或用户名查找用户，优先ID查找' })
  @ApiQuery({ name: 'id', required: false, description: '用户ID' })
  @ApiQuery({ name: 'username', required: false, description: '用户名' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功查找用户',
    schema: responseSchema('ok', '成功查找用户', {
      type: 'object',
      properties: guestGetUserDtoProps,
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
    schema: responseSchema('not found', '用户不存在'),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误，必须提供 id 或 username',
    schema: responseSchema('bad request', '请求参数错误'),
  })
  @Get('/find-one')
  async findOne(
    @Query('id') id?: string,
    @Query('username') username?: string,
  ) {
    if (id) {
      const one = this.usersService.findOne(id);
      if (one) {
        const dto = plainToInstance(GuestGetUserDto, one);
        return responseSuccess('ok', dto, '成功查找用户');
      }
      throw responseError('not found', { msg: '用户不存在' });
    }

    if (username) {
      const one = this.usersService.findOneByUsername(username);
      if (one) {
        const dto = plainToInstance(GuestGetUserDto, one);
        return responseSuccess('ok', dto, '成功查找用户');
      }
      throw responseError('not found', { msg: '用户不存在' });
    }

    throw responseError('bad request', { msg: '请求参数错误' });
  }

  /**
   * 查找自己的用户信息。
   * @returns 查找到的用户
   * @throws
   * - `not found` 用户不存在
   */
  @ApiOperation({ summary: '查找自己的用户信息' })
  @ApiNeedAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功查找用户',
    schema: responseSchema('ok', '成功查找用户', {
      type: 'object',
      properties: guestGetUserDtoProps,
    }),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '用户不存在',
    schema: responseSchema('not found', '用户不存在'),
  })
  @Auth()
  @Get('/find-self')
  async findSelf(@Body() body: UserInfo) {
    const { id } = body.user;
    const one = this.usersService.findOne(id);
    if (one) {
      const dto = plainToInstance(OwnerGetUserDto, one);
      return responseSuccess('ok', dto, '成功查找用户');
    }
    throw responseError('not found', { msg: '用户不存在' });
  }

  /**
   * 更新自己的用户信息。
   * @param updateUserDto 更新用户信息
   * @returns 更新成功
   * @throws
   * - `bad request` 请求参数错误，验证失败
   * - `ok` 更新成功
   **/
  @ApiOperation({ summary: '更新用户信息' })
  @ApiNeedAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    schema: responseSchema('ok', '更新成功', {
      type: 'object',
      properties: ownerGetUserDtoProps,
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '请求参数错误，验证失败',
    schema: responseSchema('bad request', '${error.message}'),
  })
  @Auth()
  @Post('/update-self')
  updateSelf(@Body() updateUserDto: UpdateUserDto & UserInfo) {
    let validatedUpdateUserDto: UpdateUserDto;
    try {
      validatedUpdateUserDto = plainToInstance(UpdateUserDto, updateUserDto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { id } = updateUserDto.user;

    const result = this.usersService.update(id, validatedUpdateUserDto);
    const dto = plainToInstance(OwnerGetUserDto, result);
    return responseSuccess('ok', dto, '更新成功');
  }
}
