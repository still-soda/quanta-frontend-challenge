import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Assets, AssetsSchema } from '../../schemas/assets.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Assets.name, schema: AssetsSchema }]),
  ],
  providers: [AssetsService],
  exports: [AssetsService, MongooseModule],
})
export class AssetsModule {}
