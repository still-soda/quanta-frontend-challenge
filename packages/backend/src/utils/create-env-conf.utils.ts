import { ConfigModule } from '@nestjs/config';

export function createEnvConfModule() {
  return ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
  });
}
