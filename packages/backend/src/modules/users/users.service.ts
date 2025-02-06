import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from '../../schemas/users.schema';
import validateData from '../../utils/validate-data.utils';
import { UserUpdateDto } from './dto/user-update.dto';
import { AssetsService, MulterFile } from '../assets/assets.service';
import { responseError } from 'src/utils/http-response.utils';
import { MimeType } from '../assets/mime-type.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
    private readonly assetsService: AssetsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto = await validateData(CreateUserDto, createUserDto);
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    updateUserDto = await validateData(UpdateUserDto, updateUserDto);
    return this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  async userUpdate(id: string, userUpdateDto: UserUpdateDto) {
    userUpdateDto = await validateData(UserUpdateDto, userUpdateDto);
    return this.userModel.findByIdAndUpdate({ _id: id }, userUpdateDto, {
      new: true,
    });
  }

  /**
   * 上传并更新头像。
   * @param id 用户ID
   * @param file 头像文件
   * @returns 操作是否成功。
   */
  async updateAvatar(id: string, file: MulterFile) {
    if (!file.mimetype.startsWith('image/')) {
      throw responseError('bad request', { msg: '只能上传图片文件' });
    }

    const { ok, id: metadataId } = await this.assetsService.saveFileAsStatic({
      file: file.buffer,
      name: file.originalname,
      mimeType: file.mimetype as MimeType,
    });
    if (!ok) {
      return false;
    }

    await this.update(id, { avatarId: metadataId });
    return true;
  }

  remove(id: string): Promise<any> {
    return this.userModel.deleteOne({ _id: id });
  }

  increaseUserScore(id: string, score: number) {
    return this.userModel.findByIdAndUpdate(
      { _id: id },
      { $inc: { totalScore: score } },
      { new: true },
    );
  }

  submitChallenge(
    id: string,
    taskId: string,
    options: {
      status: 'failed' | 'trying' | 'success';
      score?: number;
    },
  ) {
    const $addToSet = {};
    const $pull = {};
    const $inc = { totalSubmissions: 1 };

    if (options.status === 'failed') {
      $addToSet['failedTasks'] = taskId;
      $pull['tryingTasks'] = taskId;
    } else if (options.status === 'trying') {
      $addToSet['tryingTasks'] = taskId;
      $pull['failedTasks'] = taskId;
    } else {
      $pull['tryingTasks'] = taskId;
      $pull['failedTasks'] = taskId;
      $addToSet['solvedTasks'] = taskId;
      $inc['totalScore'] = options.score ?? 0;
    }

    return this.userModel.findByIdAndUpdate(
      { _id: id },
      { $inc, $addToSet, $pull },
      { new: true },
    );
  }
}
