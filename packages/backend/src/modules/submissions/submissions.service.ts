import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Submissions,
  SubmissionsDocument,
} from '../../schemas/submissions.schema';
import { DeleteResult, Model } from 'mongoose';
import validateData from '../../utils/validate-data.utils';
import { CommitHeatmapService } from '../commit-heatmap/commit-heatmap.service';
import { responseError } from '../../utils/http-response.utils';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submissions.name)
    private readonly submissionModel: Model<SubmissionsDocument>,
    private readonly commitHeatmapService: CommitHeatmapService,
  ) { }

  async create(createSubmissionDto: CreateSubmissionDto) {
    try {
      createSubmissionDto = await validateData(
        CreateSubmissionDto,
        createSubmissionDto,
      );
    } catch (error) {
      throw responseError('bad request', { msg: error.message });
    }

    if (createSubmissionDto.type === 'execute') {
      await this.commitHeatmapService.increaseHeatmapCount({
        date: Date.now().toString(),
        userId: createSubmissionDto.userId,
      });
    }

    return await this.submissionModel.create(createSubmissionDto);
  }

  async findAll() {
    return await this.submissionModel.find().exec();
  }

  async findOne(id: string) {
    return await this.submissionModel.findById(id).exec();
  }

  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    updateSubmissionDto = await validateData(
      UpdateSubmissionDto,
      updateSubmissionDto,
    );
    return this.submissionModel.updateOne({ _id: id }, updateSubmissionDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.submissionModel.deleteOne({ _id: id });
  }
}
