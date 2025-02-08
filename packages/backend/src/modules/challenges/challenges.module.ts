import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenges, ChallengesSchema } from '../../schemas/challenges.schema';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenges.name, schema: ChallengesSchema },
    ]),
    AssetsModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [MongooseModule, ChallengesService],
})
export class ChallengesModule {}
