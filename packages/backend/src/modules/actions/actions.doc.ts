import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiNeedAuth, ROLE } from '../../common/decorators/auth.decorator';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { ownerGetActionsDtoProps } from './dto/owner-get-actions.dto';

/**
 * Actions 模块的文档
 */
export const ActionsDoc = new ApiDocumentHelper({
  '/my-action': () => {
    return [
      ApiOperation({ summary: '获取当前用户的所有 Action' }),
      ApiNeedAuth(),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'array',
          items: {
            type: 'object',
            properties: ownerGetActionsDtoProps,
          },
        }),
      }),
    ];
  },
  '/get-action/:id': () => {
    return [
      ApiOperation({
        summary: '根据 ID 获取 Action',
        description: '非超级管理员无权查看其他用户的 Action',
      }),
      ApiNeedAuth({ level: ROLE.SUPER_ADMIN }),
      ApiResponse({
        status: 200,
        description: '获取成功',
        schema: responseSchema('ok', '获取成功', {
          type: 'object',
          properties: ownerGetActionsDtoProps,
        }),
      }),
    ];
  },
});
