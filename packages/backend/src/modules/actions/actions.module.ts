import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Actions, ActionsSchema } from '../../schemas/actions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Actions.name, schema: ActionsSchema }
    ])
  ],
  controllers: [ActionsController],
  providers: [ActionsService],
  exports: [ActionsService, MongooseModule]
})
export class ActionsModule { }
