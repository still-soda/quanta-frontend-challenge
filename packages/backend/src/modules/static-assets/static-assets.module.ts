import { Module } from '@nestjs/common';
import { StaticAssetsService } from './static-assets.service';

@Module({
  providers: [StaticAssetsService]
})
export class StaticAssetsModule {}
