import * as path from 'path';
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
import { TasksModule } from './modules/tasks/tasks.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';
import { CachesModule } from './modules/caches/caches.module';
import { IpLimitGuard } from './common/guards/ip-limit.guard';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { CommitHeatmapModule } from './modules/commit-heatmap/commit-heatmap.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RankModule } from './modules/rank/rank.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CounterModule } from './modules/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/quanta-frontend-challenge'),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, process.env.STATIC_ROOT),
      serveRoot: process.env.STATIC_URL,
    }),
    BullModule.forRoot({
      redis: { host: 'localhost', port: 6379 },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    UsersModule,
    ChallengesModule,
    ActionsModule,
    NotificationsModule,
    SubmissionsModule,
    JudgementsModule,
    AssetsModule,
    AuthModule,
    TasksModule,
    CachesModule,
    CommitHeatmapModule,
    RankModule,
    CounterModule,
  ],
  controllers: [],
  providers: [
    { provide: 'APP_GUARD', useClass: AuthGuard },
    { provide: 'APP_GUARD', useClass: IpLimitGuard },
    { provide: 'APP_INTERCEPTOR', useClass: CacheInterceptor },
  ],
})
export class AppModule {}
