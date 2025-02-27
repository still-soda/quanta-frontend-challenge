import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rank, RankSchema } from '../../schemas/rank.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rank.name, schema: RankSchema }
    ]),
    UsersModule
  ],
  controllers: [RankController],
  providers: [RankService],
  exports: [RankService, MongooseModule]
})
export class RankModule { }
