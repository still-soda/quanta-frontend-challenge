import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { ActionsModule } from './modules/actions/actions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskExecutionModule } from './modules/task-execution/task-execution.module';
import { StaticAssetsModule } from './modules/static-assets/static-assets.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ChallengesModule,
    ActionsModule,
    NotificationsModule,
    SubmissionsModule,
    MongooseModule.forRoot('mongodb://localhost/quanta-frontend-challenge'),
    TaskExecutionModule,
    StaticAssetsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
