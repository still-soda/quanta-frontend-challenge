import { HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiNeedAuth } from '../../common/decorators/auth.decorator';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';

export const CommitHeatmapDoc = new ApiDocumentHelper({
  '/get-heatmap': () => {
    return [
      ApiOperation({ summary: '获取用户的提交热力图数据' }),
      ApiNeedAuth(),
      ApiResponse({
        status: HttpStatus.OK,
        description: '获取用户的提交热力图数据',
        schema: responseSchema('ok', '成功获取[${username}]的提交热力图数据', {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: {
                type: 'string',
                example: '2021-01-01',
                description: '日期',
              },
              count: { type: 'number', example: 123, description: '提交次数' },
              userId: {
                type: 'string',
                example: '123',
                description: '用户 ID',
              },
            },
          },
        }),
      }),
    ];
  },
});
