import { Module } from '@nestjs/common';
import { CachesService } from './caches.service';

@Module({
  providers: [CachesService],
})
export class CachesModule {}
