import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { ActionsModule } from './modules/actions/actions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JudgementsModule } from './modules/judgements/judgements.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/quanta-frontend-challenge'),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    UsersModule,
    ChallengesModule,
    ActionsModule,
    NotificationsModule,
    SubmissionsModule,
    JudgementsModule,
    AssetsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
