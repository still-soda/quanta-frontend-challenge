import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { getFileMetaDtoProps } from './dto/get-file-meta.dto';
import { ApiNeedAuth } from '../../common/decorators/auth.decorator';

export const AssetsDoc = new ApiDocumentHelper({
  '/static-metadata': () => {
    return [
      ApiOperation({ summary: '获取文件的静态信息' }),
      ApiNeedAuth(),
      ApiBody({
        description: '文件ID列表',
        schema: {
          type: 'object',
          properties: {
            fileIdList: {
              type: 'array',
              items: {
                type: 'string',
                example: 'fileId',
              },
            },
          },
        },
      }),
      ApiResponse({
        status: 200,
        description: '成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: getFileMetaDtoProps,
        }),
      }),
    ];
  },
});
