import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Auth, ROLE } from '../../common/decorators/auth.decorator';
import { UseCache } from '../../common/decorators/cache.decorator';
import { responseSuccess } from '../../utils/http-response.utils';
import { GetFileMetaDto } from './dto/get-file-meta.dto';
import { filterData } from '../../utils/filter-data.utils';
import { AssetsDoc } from './assets.doc';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  /**
   * 获取文件的静态信息
   * @param fileIdList 文件ID列表
   * @returns 文件的静态信息
   */
  @AssetsDoc.forRoute('/static-metadata')
  @Auth()
  @UseCache()
  @HttpCode(200)
  @Post('static-metadata')
  async getStaticFileMetadata(@Body('fileIdList') fileId: string[]) {
    const result = await this.assetsService.getFileMataDataByIdList(fileId);
    const filterResult = filterData(GetFileMetaDto, result as any);
    return responseSuccess('ok', filterResult, '获取成功');
  }

  /**
   * 管理员读取文件内容
   * @param fileId 文件ID
   * @returns 文件内容
   */
  @AssetsDoc.forRoute('/read-one')
  @Auth(ROLE.ADMIN)
  @UseCache()
  @HttpCode(200)
  @Get('/read-one/:fileId')
  async adminReadFile(@Param('fileId') fileId: string) {
    const result = await this.assetsService.readTextFileById(fileId);
    return responseSuccess('ok', result, '获取成功');
  }
}
