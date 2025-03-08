import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Counter, CounterDocument } from '../../schemas/counter.schema';
import { Model } from 'mongoose';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,
  ) {}

  async nextValue(sequenceName: string) {
    const result = await this.counterModel.findOneAndUpdate(
      { sequenceName },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true },
    );
    return result.sequenceValue;
  }
}
