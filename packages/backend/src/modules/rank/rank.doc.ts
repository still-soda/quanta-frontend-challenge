import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApiNeedAuth, ROLE } from '../../common/decorators/auth.decorator';
import { responseSchema } from '../../utils/http-response.utils';
import { ApiDocumentHelper } from '../../utils/doc-helper.utils';
import { getRankDtoProps } from './dto/get-rank.dto';

/**
 * 排行榜模块的文档
 */
export const RankDoc = new ApiDocumentHelper({
  '/recent-rank': () => {
    return [
      ApiOperation({ summary: '获取最近一次更新的全体排名' }),
      ApiResponse({
        status: 200,
        description: '成功获取',
        schema: responseSchema('ok', '成功获取', {
          type: 'array',
          items: { type: 'object', properties: getRankDtoProps },
        }),
      }),
    ];
  },
  '/my-history': () => {
    return [
      ApiOperation({ summary: '获取我的排名历史' }),
      ApiNeedAuth(),
      ApiResponse({
        status: 200,
        description: '成功获取',
        schema: responseSchema('ok', '成功获取', {
          type: 'object',
          properties: {
            history: {
              type: 'array',
              items: {
                type: 'object',
                properties: getRankDtoProps,
              },
              description: '排名历史',
            },
            earliestRankCount: { type: 'number', description: '最早的排名' },
          },
        }),
      }),
    ];
  },
  '/someones-history': () => {
    return [
      ApiOperation({ summary: '获取某个用户的排名历史' }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiQuery({ name: 'userId', type: 'string', description: '用户ID' }),
      ApiResponse({
        status: 200,
        description: '成功获取',
        schema: responseSchema('ok', '成功获取', {
          type: 'array',
          items: { type: 'object', properties: getRankDtoProps },
        }),
      }),
    ];
  },
  '/force-update': () => {
    return [
      ApiOperation({ summary: '强制更新排名' }),
      ApiNeedAuth({ level: ROLE.SUPER_ADMIN }),
      ApiResponse({
        status: 200,
        description: '成功更新排名',
        schema: responseSchema('ok', '成功更新排名', {
          type: 'array',
          items: { type: 'object', properties: getRankDtoProps },
        }),
      }),
      ApiResponse({
        status: 500,
        description: '排行榜数据插入失败 / 更新排行榜时间失败',
        schema: responseSchema(
          'internal server error',
          '排行榜数据插入失败 / 更新排行榜时间失败',
        ),
      }),
    ];
  },
  '/history-sometime': () => {
    return [
      ApiOperation({ summary: '获取某个时间点的全体排名' }),
      ApiNeedAuth({ level: ROLE.ADMIN }),
      ApiQuery({
        name: 'time',
        description: '时间点，是一个可以被 `Date.parse` 解析的字符串',
      }),
      ApiResponse({
        status: 200,
        description: '成功获取',
        schema: responseSchema('ok', '成功获取', {
          type: 'array',
          items: { type: 'object', properties: getRankDtoProps },
        }),
      }),
    ];
  },
});
