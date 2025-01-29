import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Submissions, SubmissionsSchema } from 'src/schemas/submissions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submissions.name, schema: SubmissionsSchema },
    ]),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
  exports: [MongooseModule],
})
export class SubmissionsModule {}
