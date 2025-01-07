import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from '../../schemas/users.schema';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
  ) {}

  create(createUserDto: CreateUserDto) {
    createUserDto = plainToInstance(CreateUserDto, createUserDto, {
      excludeExtraneousValues: true,
    });
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    updateUserDto = plainToInstance(UpdateUserDto, updateUserDto, {
      excludeExtraneousValues: true,
    });
    return this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
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
    const $push = {};
    const $pull = {};
    const $inc = { totalSubmissions: 1 };

    if (options.status === 'failed') {
      $push['failedTasks'] = taskId;
      $pull['tryingTasks'] = taskId;
    } else if (options.status === 'trying') {
      $push['tryingTasks'] = taskId;
      $pull['failedTasks'] = taskId;
    } else {
      $pull['tryingTasks'] = taskId;
      $pull['failedTasks'] = taskId;
      $push['solvedTasks'] = taskId;
      $inc['totalScore'] = options.score ?? 0;
    }

    return this.userModel.findByIdAndUpdate(
      { _id: id },
      { $inc, $push, $pull },
      { new: true },
    );
  }
}
