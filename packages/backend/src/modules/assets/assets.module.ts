import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Assets, AssetsSchema } from '../../schemas/assets.schema';
import { AssetsController } from './assets.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Assets.name, schema: AssetsSchema }]),
  ],
  providers: [AssetsService],
  controllers: [AssetsController],
  exports: [AssetsService, MongooseModule],
})
export class AssetsModule {}
