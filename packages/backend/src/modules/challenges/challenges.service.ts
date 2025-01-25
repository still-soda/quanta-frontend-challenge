import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import {
  Challenges,
  ChallengesDocument,
  ChallengeStatus,
} from '../../schemas/challenges.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import validateData from '../../utils/validate-data.utils';

const statusOrder: ChallengeStatus[] = [
  'draft',
  'ready',
  'published',
  'closed',
];

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

  async findByStatus(status: ChallengeStatus) {
    return await this.challengeModel.find({ status }).exec();
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

  async setStatusToReady(id: string) {
    const challenge = await this.findOne(id);
    const currentStatusIndex = statusOrder.indexOf(challenge.status);
    const readyStatusIndex = statusOrder.indexOf('ready');
    if (readyStatusIndex - currentStatusIndex !== 1) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      { _id: id },
      { status: 'ready' as ChallengeStatus },
      { new: true },
    );
  }

  async setStatusToPublished(id: string) {
    const challenge = await this.findOne(id);
    const currentStatusIndex = statusOrder.indexOf(challenge.status);
    const publishedStatusIndex = statusOrder.indexOf('published');
    if (publishedStatusIndex - currentStatusIndex !== 1) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      { _id: id },
      { status: 'published' as ChallengeStatus },
      { new: true },
    );
  }

  async setStatusToClosed(id: string) {
    const challenge = await this.findOne(id);
    const currentStatusIndex = statusOrder.indexOf(challenge.status);
    const closedStatusIndex = statusOrder.indexOf('closed');
    if (closedStatusIndex - currentStatusIndex !== 1) {
      return null;
    }
    return await this.challengeModel.findByIdAndUpdate(
      { _id: id },
      { status: 'closed' as ChallengeStatus },
      { new: true },
    );
  }

  async pushScreenshot(challengeId: string, screenshotId: string) {
    return await this.challengeModel.findByIdAndUpdate(
      { _id: challengeId },
      { $push: { screenshots: screenshotId } },
      { new: true },
    );
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
