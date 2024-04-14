import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { Config } from 'src/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FingerprintModule } from './fingerprint/fingerprint.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object<Config>({
        DB_NAME: Joi.string().required(),
        DB_URL: Joi.string().required(),
      }),
    }),
    UtilModule,
    FingerprintModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
