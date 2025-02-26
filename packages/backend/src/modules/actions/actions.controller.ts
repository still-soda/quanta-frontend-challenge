import { Controller, Get, Param } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ApiNeedAuth, Auth, ROLE } from '../../common/decorators/auth.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser, UserData } from '../../common/decorators/user.decorator';
import { responseError, responseSchema, responseSuccess } from '../../utils/http-response.utils';
import { ownerGetActionsDtoProps } from './dto/owner-get-actions.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) { }

  /**
   * 获取当前用户的所有 Action
   * @param user 用户信息
   * @returns 用户的所有 Action
   */
  @ApiOperation({ summary: '获取当前用户的所有 Action' })
  @ApiNeedAuth()
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'array',
      items: {
        type: 'object',
        properties: ownerGetActionsDtoProps
      }
    })
  })
  @Get('/my-action')
  @Auth()
  async findAll(@CurrentUser() user: UserData) {
    const result = await this.actionsService.findByUserId(user.id);
    return responseSuccess('ok', result, '获取成功');
  }

  /**
   * 根据 ID 获取 Action
   * 
   * 用户调用会报错：越权操作，普通管理员会报错：
   * 非超级管理员无权查看其他用户的 Action
   * @param user 用户信息
   * @param id Action ID
   * @returns Action 信息列表
   */
  @ApiOperation({
    summary: '根据 ID 获取 Action',
    description: '非超级管理员无权查看其他用户的 Action'
  })
  @ApiNeedAuth({ level: ROLE.SUPER_ADMIN })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: responseSchema('ok', '获取成功', {
      type: 'object',
      properties: ownerGetActionsDtoProps
    })
  })
  @Get('/get-action/:id')
  @Auth(ROLE.SUPER_ADMIN)
  async findAllById(@Param('id') id: string) {
    const result = await this.actionsService.findByUserId(id);
    return responseSuccess('ok', result, '获取成功');
  }
}
