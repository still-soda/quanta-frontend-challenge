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

  /**
   * 获取下一个自增序列值，如果不存在则创建
   * @param sequenceName 序列名称
   * @returns 下一个序列值
   */
  async nextValue(sequenceName: string) {
    const result = await this.counterModel.findOneAndUpdate(
      { sequenceName },
      { $inc: { sequenceValue: 1 } },
      { new: true, upsert: true },
    );
    return result.sequenceValue;
  }
}
