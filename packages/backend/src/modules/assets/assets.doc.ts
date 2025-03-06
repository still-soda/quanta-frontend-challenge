import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { getFileMetaDtoProps } from './dto/get-file-meta.dto';

export const AssetsDoc = new ApiDocumentHelper({
  '/static-metadata': () => {
    return [
      ApiOperation({ summary: '获取文件的静态信息' }),
      ApiBody({
        description: '文件ID列表',
        type: [String],
      }),
      ApiResponse({
        status: 200,
        description: '成功',
        schema: responseSchema('ok', '获取成功', {
          schema: getFileMetaDtoProps,
        }),
      }),
    ];
  },
});
