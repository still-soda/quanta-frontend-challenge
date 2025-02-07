import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AssetsModule } from '../assets/assets.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notifications,
  NotificationsSchema,
} from '../../schemas/notifications.schema';

@Module({
  imports: [
    AssetsModule,
    MongooseModule.forFeature([
      { name: Notifications.name, schema: NotificationsSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService, MongooseModule],
})
export class NotificationsModule {}
