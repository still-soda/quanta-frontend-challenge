import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function createMockDBModule() {
  const mongodb = await MongoMemoryServer.create();
  const uri = mongodb.getUri();
  const module = MongooseModule.forRoot(uri);

  return { module, mongodb };
}
