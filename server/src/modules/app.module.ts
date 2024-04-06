import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FingerprintModule } from './fingerprint/fingerprint.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [UtilModule, FingerprintModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
