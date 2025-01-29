import { Module } from '@nestjs/common';
import { JudgementsService } from './judgements.service';
import { AssetsModule } from '../assets/assets.module';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [AssetsModule, ChallengesModule],
  providers: [JudgementsService],
})
export class JudgementsModule {}
