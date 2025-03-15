import { Module } from '@nestjs/common';
import { ResolvedChallengeService } from './resolved-challenge.service';
import { ResolvedChallengeController } from './resolved-challenge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ResolvedChallenge,
  ResolvedChallengeSchema,
} from '../../schemas/resolved-challenge.schema';
import { CounterModule } from '../counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResolvedChallenge.name, schema: ResolvedChallengeSchema },
    ]),
    CounterModule,
  ],
  controllers: [ResolvedChallengeController],
  providers: [ResolvedChallengeService],
  exports: [ResolvedChallengeService, MongooseModule],
})
export class ResolvedChallengeModule {}
