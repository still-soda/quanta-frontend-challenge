import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenges, ChallengesSchema } from '../../schemas/challenges.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenges.name, schema: ChallengesSchema },
    ]),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [MongooseModule, ChallengesService],
})
export class ChallengesModule {}
