import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
import { Tags, TagsDocument } from '../../schemas/tags.schema';
import validateData from '../../utils/validate-data.utils';
import { responseError } from '../../utils/http-response.utils';
import { isMongoId } from 'class-validator';
import { AssetsService, MulterFile } from '../assets/assets.service';
import { MimeType } from '../assets/mime-type.type';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name) private readonly tagsModel: Model<TagsDocument>,
    private readonly assetsService: AssetsService,
  ) {}

  /**
   * 创建标签
   * @param createTagDto 创建标签数据
   * @param userId 当前用户ID
   * @returns 创建的标签
   * @throws
   * - `bad request` 请求参数错误
   */
  async create(createTagDto: CreateTagDto, userId: string) {
    try {
      createTagDto = await validateData(CreateTagDto, createTagDto);
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    if (!isMongoId(userId)) {
      throw responseError('bad request', { msg: '用户ID格式错误' });
    }

    return this.tagsModel.create({
      ...createTagDto,
      creatorId: userId,
    });
  }

  /**
   * 获取所有标签
   * @returns 所有标签
   */
  async findAll() {
    return this.tagsModel.find();
  }

  /**
   * 获取标签
   * @param id 标签ID
   * @returns 标签
   * @throws
   * - `bad request` 标签ID格式错误
   */
  async findById(id: string) {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: '标签ID格式错误' });
    }

    return this.tagsModel.findById(id);
  }

  /**
   * 更新标签
   * @param id 标签ID
   * @param updateTagDto 更新数据
   * @returns 更新结果
   * @throws
   * - `bad request` 标签ID格式错误
   */
  async updateById(id: string, updateTagDto: UpdateTagDto) {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: '标签ID格式错误' });
    }

    return this.tagsModel.updateOne({ _id: id }, updateTagDto);
  }

  /**
   * 删除标签
   * @param id 标签ID
   * @returns 删除结果
   * @throws
   * - `bad request` 标签ID格式错误
   */
  async remove(id: string): Promise<DeleteResult> {
    if (!isMongoId(id)) {
      throw responseError('bad request', { msg: '标签ID格式错误' });
    }

    return this.tagsModel.deleteOne({ _id: id });
  }

  /**
   * 根据创建者ID查找标签
   * @param creatorId 创建者ID
   * @returns 标签列表
   * @throws
   * - `bad request` 用户ID格式错误
   */
  async findByCreatorId(creatorId: string) {
    if (!isMongoId(creatorId)) {
      throw responseError('bad request', { msg: '用户ID格式错误' });
    }

    return this.tagsModel.find({ creatorId });
  }

  /**
   * 根据ID查找标签
   * @param ids 标签ID列表
   * @returns 标签列表
   */
  async findByIds(ids: string[]) {
    return this.tagsModel.find({ _id: { $in: ids } });
  }

  /**
   * 上传标签图标
   * @param id 标签ID
   * @param file 图标文件
   * @returns 上传结果
   * @throws
   * - `bad request` 标签不存在
   * - `internal server error` 上传文件失败
   */
  async uploadIcon(id: string, file: MulterFile) {
    const tag = await this.findById(id);
    if (!tag) {
      throw responseError('bad request', { msg: '标签不存在' });
    }

    const { ok, id: imageId } = await this.assetsService.saveFileAsStatic({
      file: file.buffer,
      name: file.originalname,
      mimeType: file.mimetype as MimeType,
    });
    if (!ok) {
      throw responseError('internal server error', {
        msg: '上传文件失败',
        withoutStack: false,
      });
    }

    const path = await this.assetsService.resolveStaticFilePath(imageId);
    return await this.tagsModel.updateOne({ _id: id }, { icon: path });
  }
}
