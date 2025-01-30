import { ConfigModule } from '@nestjs/config';

export function createEnvConfModule(...envFilePaths: string[]) {
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [...envFilePaths, `.env.${process.env.NODE_ENV}`, '.env'],
  });
}
