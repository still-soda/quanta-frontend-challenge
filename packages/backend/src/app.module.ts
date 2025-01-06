import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { ActionsModule } from './modules/actions/actions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    ChallengesModule,
    ActionsModule,
    NotificationsModule,
    SubmissionsModule,
    MongooseModule.forRoot('mongodb://localhost/quanta-frontend-challenge'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
