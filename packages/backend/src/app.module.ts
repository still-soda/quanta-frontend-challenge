import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ActionsModule } from './actions/actions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    UsersModule,
    ChallengesModule,
    ActionsModule,
    NotificationsModule,
    SubmissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
