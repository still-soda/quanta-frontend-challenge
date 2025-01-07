import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import {
  Challenges,
  ChallengesDocument,
} from '../../schemas/challenges.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenges.name)
    private readonly challengeModel: Model<ChallengesDocument>,
  ) {}

  create(createChallengeDto: CreateChallengeDto) {
    const createdChallenge = new this.challengeModel(createChallengeDto);
    return createdChallenge.save();
  }

  findAll() {
    return this.challengeModel.find().exec();
  }

  findOne(id: string) {
    return this.challengeModel.findById(id);
  }

  update(id: string, updateChallengeDto: UpdateChallengeDto) {
    updateChallengeDto = plainToInstance(
      UpdateChallengeDto,
      updateChallengeDto,
      { excludeExtraneousValues: true },
    );
    return this.challengeModel.findByIdAndUpdate(
      { _id: id },
      updateChallengeDto,
      { new: true },
    );
  }

  remove(id: string): Promise<any> {
    return this.challengeModel.deleteOne({ _id: id });
  }
}
