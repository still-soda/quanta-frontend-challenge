import { Injectable } from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import validateData from '../../utils/validate-data.utils';
import { responseError } from '../../utils/http-response.utils';
import { Model } from 'mongoose';
import { Actions, ActionsDocument } from '../../schemas/actions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserData } from '../../common/decorators/user.decorator';
import { ROLE } from '../../common/decorators/auth.decorator';

@Injectable()
export class ActionsService {
  constructor(
    @InjectModel(Actions.name)
    private readonly actionsModel: Model<ActionsDocument>
  ) { }

  /**
   * 创建 Action
   * @param createActionDto 创建数据
   * @param user 用户信息
   * @returns 创建后的 Action 信息
   * @throws
   * - `bad request` 请求数据错误 / JSON 序列化错误
   * - `forbidden` 非超级管理员不能代替别人创建 Action
   */
  async create(
    createActionDto: CreateActionDto,
    user: UserData
  ): Promise<ActionsDocument> {
    try {
      createActionDto = await validateData(CreateActionDto, createActionDto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    const { id: userId, role } = user;
    if (createActionDto.userId !== userId && role < ROLE.SUPER_ADMIN) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替别人创建 Action'
      });
    }

    try {
      const createData: Omit<CreateActionDto, 'payload'> & {
        payload: string
      } = {
        ...createActionDto,
        payload: JSON.stringify(createActionDto.payload)
      }

      return await this.actionsModel.create(createData);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }
  }

  /**
   * 获取 Action 信息
   * @param id Action ID
   * @returns Action 信息
   */
  findByUserId(userId: string): Promise<ActionsDocument[]> {
    return this.actionsModel.find({ userId });
  }

  /**
   * 更新 Action 信息
   * @param id Action ID
   * @param updateActionDto 更新数据 
   * @param user 用户信息
   * @returns 更新后的 Action 信息
   * @throws
   * - `not found` 不存在 Action
   * - `forbidden` 非超级管理员不能代替别人创建 Action
   * - `bad request` 请求数据错误
   */
  async update(id: string, updateActionDto: UpdateActionDto, user: UserData) {
    const action = await this.actionsModel.findById(id);
    if (!action) {
      throw responseError('not found', { msg: '不存在 Action' });
    }

    const { id: userId, role } = user;
    if (action.userId !== userId && role < ROLE.SUPER_ADMIN) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替别人创建 Action'
      });
    }

    try {
      updateActionDto = await validateData(UpdateActionDto, updateActionDto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    return await this.actionsModel.findByIdAndUpdate(id, updateActionDto, {
      new: true
    });
  }

  /**
   * 删除 Action
   * @param id Action ID
   * @param user 用户信息
   * @returns 删除后的 Action 信息
   * @throws
   * - `not found` 不存在 Action
   * - `forbidden` 非超级管理员不能代替别人创建 Action
   */
  async remove(id: string, user: UserData) {
    const action = await this.actionsModel.findById(id);
    if (!action) {
      throw responseError('not found', { msg: '不存在 Action' });
    }

    const { id: userId, role } = user;
    if (action.userId !== userId && role < ROLE.SUPER_ADMIN) {
      throw responseError('forbidden', {
        msg: '非超级管理员不能代替别人创建 Action'
      });
    }

    return this.actionsModel.findByIdAndDelete(id);
  }
}
