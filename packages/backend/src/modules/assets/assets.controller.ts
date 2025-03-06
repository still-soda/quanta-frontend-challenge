import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { UseCache } from '../../common/decorators/cache.decorator';
import {
  responseSchema,
  responseSuccess,
} from '../../utils/http-response.utils';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetFileMetaDto, getFileMetaDtoProps } from './dto/get-file-meta.dto';
import { filterData } from '../../utils/filter-data.utils';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  /**
   * 获取文件的静态信息
   * @param fileIdList 文件ID列表
   * @returns 文件的静态信息
   */
  @ApiOperation({ summary: '获取文件的静态信息' })
  @ApiBody({
    description: '文件ID列表',
    type: [String],
  })
  @ApiResponse({
    status: 200,
    description: '成功',
    schema: responseSchema('ok', '获取成功', { schema: getFileMetaDtoProps }),
  })
  @Auth()
  @UseCache()
  @HttpCode(200)
  @Post('static-metadata')
  async getStaticFileMetadata(@Body('fileIdList') fileId: string[]) {
    const result = await this.assetsService.getFileMataDataByIdList(fileId);
    const filterResult = filterData(GetFileMetaDto, result as any);
    return responseSuccess('ok', filterResult, '获取成功');
  }
}
