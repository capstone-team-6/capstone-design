import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DatabaseService, FirebaseService],
  exports: [DatabaseService, FirebaseService],
})
export class UtilModule {}
