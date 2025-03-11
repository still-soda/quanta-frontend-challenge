import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from '../../common/decorators/auth.decorator';
import { IpLimit } from '../../common/decorators/ip-limit.decorator';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { filterData } from '../../utils/filter-data.utils';
import {
  responseError,
  responseSuccess,
} from '../../utils/http-response.utils';
import { MulterFile } from '../assets/assets.service';
import { GuestGetUserDto } from './dto/guest-get-user.dto';
import { OwnerGetUserDto } from './dto/owner-get-user.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsersService } from './users.service';
import { UseFileInterceptor } from '../../common/decorators/file.decorator';
import { UserDoc } from './users.doc';

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
  @UserDoc.forRoute('/find-one')
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
  @UserDoc.forRoute('/find-self')
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
   * @param userUpdateDto 更新用户信息
   * @returns 更新成功
   * @throws
   * - `bad request` 请求参数错误，验证失败
   * - `ok` 更新成功
   **/
  @UserDoc.forRoute('/update-self')
  @Auth()
  @HttpCode(200)
  @Post('/update-self')
  async updateSelf(
    @Body() userUpdateDto: UserUpdateDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.usersService.userUpdate(user.id, userUpdateDto);
    const dto = filterData(OwnerGetUserDto, result);
    return responseSuccess('ok', dto, '更新成功');
  }

  /**
   * 上传头像文件并保存，图片文件最大为 5MB。
   * @param file 头像文件
   */
  @UserDoc.forRoute('/upload-avatar')
  @UseFileInterceptor('file')
  @IpLimit(5)
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

      throw responseError('internal server error', { msg: '保存失败' });
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : responseError('internal server error', {
            msg: error.message,
            withoutStack: false,
          });
    }
  }
}
