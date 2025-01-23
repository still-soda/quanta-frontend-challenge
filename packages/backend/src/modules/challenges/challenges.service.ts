import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import {
  Challenges,
  ChallengesDocument,
} from '../../schemas/challenges.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import validateData from '../../utils/validate-data.utils';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenges.name)
    private readonly challengeModel: Model<ChallengesDocument>,
  ) {}

  async create(createChallengeDto: CreateChallengeDto) {
    createChallengeDto = await validateData(
      CreateChallengeDto,
      createChallengeDto,
    );
    const createdChallenge = new this.challengeModel(createChallengeDto);
    return createdChallenge.save();
  }

  async findAll() {
    return await this.challengeModel.find().exec();
  }

  async findOne(id: string) {
    return await this.challengeModel.findById(id);
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    updateChallengeDto = await validateData(
      UpdateChallengeDto,
      updateChallengeDto,
    );
    return this.challengeModel.findByIdAndUpdate(
      { _id: id },
      updateChallengeDto,
      { new: true },
    );
  }

  async remove(id: string): Promise<any> {
    return await this.challengeModel.deleteOne({ _id: id });
  }

  async setFlowData(challengeId: string, flowDataId: string) {
    return await this.challengeModel.findByIdAndUpdate(
      challengeId,
      { flowdataId: flowDataId },
      { new: true },
    );
  }

  async setStandardAnswer(challengeId: string, standardAnswer: string[]) {
    if (!standardAnswer || !standardAnswer.length) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      challengeId,
      { standardAnswer },
      { new: true },
    );
  }

  async solveChallenge(challengeId: string, userId: string) {
    const { fastestSolvers } = await this.findOne(challengeId);

    if (fastestSolvers.includes(userId) || fastestSolvers.length >= 3) {
      return null;
    }

    return this.challengeModel.findByIdAndUpdate(
      challengeId,
      { $push: { fastestSolvers: userId } },
      { new: true },
    );
  }
}
