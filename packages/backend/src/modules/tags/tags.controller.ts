import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UploadedFile,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Auth, ROLE } from 'src/common/decorators/auth.decorator';
import { CurrentUser, UserData } from 'src/common/decorators/user.decorator';
import { responseSuccess } from 'src/utils/http-response.utils';
import { TagsDoc } from './tags.doc';
import { UseCache } from 'src/common/decorators/cache.decorator';
import { MulterFile } from '../assets/assets.service';
import { UseFileInterceptor } from 'src/common/decorators/file.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * 创建标签
   * @param createTagDto 创建标签数据
   * @param user 当前用户
   * @returns 创建的标签
   */
  @TagsDoc.forRoute('/create')
  @Post('/create')
  @HttpCode(201)
  @Auth(ROLE.ADMIN)
  async create(
    @Body() createTagDto: CreateTagDto,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.tagsService.create(createTagDto, user.id);
    return responseSuccess('created', result, '创建成功');
  }

  /**
   * 获取所有标签
   * @returns 所有标签
   */
  @TagsDoc.forRoute('/find-all')
  @Get('/find-all')
  @UseCache()
  async findAll() {
    const result = await this.tagsService.findAll();
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 获取标签
   * @param id 标签ID
   * @returns 标签
   */
  @TagsDoc.forRoute('/find-one')
  @Get('/find-one/:id')
  async findOne(@Param('id') id: string) {
    const result = await this.tagsService.findById(id);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 更新标签
   * @param id 标签ID
   * @param updateTagDto 更新数据
   * @returns 更新结果
   */
  @TagsDoc.forRoute('/update')
  @Post('/update/:id')
  @Auth(ROLE.ADMIN)
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    const result = await this.tagsService.updateById(id, updateTagDto);
    return responseSuccess('ok', result, '更新成功');
  }

  /**
   * 删除标签
   * @param id 标签ID
   * @returns 删除结果
   */
  @TagsDoc.forRoute('/delete')
  @Post('/delete/:id')
  @Auth(ROLE.ADMIN)
  async remove(@Param('id') id: string): Promise<any> {
    await this.tagsService.remove(id);
    return responseSuccess('ok', null, '删除成功');
  }

  /**
   * 获取创建的标签
   * @param user 当前用户
   * @returns 创建的标签
   */
  @TagsDoc.forRoute('/find-by-creator')
  @Get('/find-by-creator')
  @Auth(ROLE.ADMIN)
  async findMy(@CurrentUser() user: UserData) {
    const result = await this.tagsService.findByCreatorId(user.id);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 根据ID数组获取标签
   * @param ids 标签ID数组
   * @returns 标签列表
   */
  @TagsDoc.forRoute('/find-by-ids')
  @Post('/find-by-ids')
  async findByIds(@Body('ids') ids: string[]) {
    const result = this.tagsService.findByIds(ids);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 上传标签图标
   * @param file 图标文件
   * @param id 标签ID
   * @returns 上传结果
   */
  @TagsDoc.forRoute('/upload-icon')
  @Post('/upload-icon/:id')
  @UseFileInterceptor('file', 5, 'image')
  @Auth(ROLE.ADMIN)
  async uploadIcon(
    @UploadedFile() file: MulterFile,
    @Param('id') id: string,
    @CurrentUser() user: UserData,
  ) {
    const result = await this.tagsService.uploadIcon(id, file, user);
    return responseSuccess('ok', result, '上传成功');
  }
}
