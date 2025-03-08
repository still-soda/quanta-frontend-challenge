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

  /**
   * 获取当前序列值
   * @param sequenceName 序列名称
   * @returns 当前序列值
   */
  async currentValue(sequenceName: string) {
    const result = await this.counterModel.findOne({ sequenceName });
    return result?.sequenceValue ?? 0;
  }

  /**
   * 重置序列值
   * @param sequenceName 序列名称
   * @returns 是否重置成功
   */
  async reset(sequenceName: string) {
    await this.counterModel.updateOne(
      { sequenceName },
      { sequenceValue: 0 },
      { upsert: true },
    );
    return true;
  }
}
