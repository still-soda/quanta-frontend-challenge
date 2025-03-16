import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsSchema, Tags } from '../../schemas/tags.schema';
import { AssetsModule } from '../assets/assets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
    AssetsModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService, MongooseModule],
})
export class TagsModule {}
