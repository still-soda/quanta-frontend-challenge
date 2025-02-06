import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  responseError,
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  GuestGetUserDto,
  guestGetUserDtoProps,
} from './dto/guest-get-user.dto';
import { ApiNeedAuth, Auth } from '../../common/decorators/auth.decorator';
import {
  OwnerGetUserDto,
  ownerGetUserDtoProps,
} from './dto/onwer-get-user.dto';
import validateData from '../../utils/validate-data.utils';
import { filterData } from '../../utils/filter-data.utils';
import { UserUpdateDto } from './dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { MulterFile } from '../assets/assets.service';
import { IpLimit } from 'src/common/decorators/ip-limit.decorator';

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
  @ApiOperation({
    summary: '根据用户ID或用户名查找用户',
    description: '必须携带一个 Query 参数，两个都有的情况下优先 ID 查找',
  })
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
  @HttpCode(200)
  @Get('/find-one')
  async findOne(
    @Query('id') id?: string,
    @Query('username') username?: string,
  ) {
    if (id) {
      const one = await this.usersService.findOne(id);
      if (one) {
        const dto = filterData(GuestGetUserDto, one);
        return responseSuccess('ok', dto, '成功查找用户');
      }
      throw responseError('not found', { msg: '用户不存在' });
    }

    if (username) {
      const one = await this.usersService.findOneByUsername(username);
      if (one) {
        const dto = filterData(GuestGetUserDto, one);
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
  @HttpCode(200)
  @Get('/find-self')
  async findSelf(@CurrentUser() user: UserData) {
    const { id } = user;
    const one = await this.usersService.findOne(id);
    if (one) {
      const dto = filterData(OwnerGetUserDto, one);
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
  @ApiBody({ type: UserUpdateDto })
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
  @HttpCode(200)
  @Post('/update-self')
  async updateSelf(
    @Body() updateUserDto: UserUpdateDto,
    @CurrentUser() user: UserData,
  ) {
    let validatedUpdateUserDto: UserUpdateDto;
    try {
      validatedUpdateUserDto = await validateData(UserUpdateDto, updateUserDto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { id } = user;

    const result = await this.usersService.update(id, validatedUpdateUserDto);
    const dto = filterData(OwnerGetUserDto, result);
    return responseSuccess('ok', dto, '更新成功');
  }

  /**
   * 上传头像文件并保存，图片文件最大为 5MB。
   * @param file 头像文件
   */
  @ApiOperation({
    summary: '上传头像并保存',
    description: '上传成功后会自动设置到当前用户，图片文件最大为 5MB',
  })
  @ApiNeedAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadAvatarDto,
    description: '头像文件，大小不超过 5MB',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功上传并保存',
    schema: responseSchema('ok', '成功上传并保存'),
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '保存失败或其他报错',
    schema: responseSchema('internal server error', '${error.message}'),
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        // 最大图片大小为 5MB
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @IpLimit()
  @Auth()
  @HttpCode(200)
  @Post('upload-avatar')
  async uploadAvatar(
    @CurrentUser() user: UserData,
    @UploadedFile() file: MulterFile,
  ) {
    const { id } = user;
    try {
      const ok = await this.usersService.updateAvatar(id, file);
      if (ok) {
        return responseSuccess('ok', {}, '上传并保存成功');
      }

      throw responseError('internal server error', {
        msg: '保存失败',
        withoutStack: true,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw responseError('internal server error', {
        msg: error.message,
        withoutStack: false,
      });
    }
  }
}
