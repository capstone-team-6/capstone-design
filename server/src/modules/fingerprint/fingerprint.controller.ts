import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { FingerprintAPI } from 'src/interfaces/endpoints/fingerprint';
import { QueryType } from 'src/interfaces/endpoints/type';
import { FingerprintService } from './fingerprint.service';

@Controller('/api/fingerprint')
export class FingerprintController {
  constructor(
    @Inject(FingerprintService) private fingerprintService: FingerprintService,
  ) {}

  @Post('register')
  async register(
    @Body() body: FingerprintAPI['register']['body'],
  ): Promise<FingerprintAPI['register']['response']> {
    return this.fingerprintService.register(body);
  }

  @Get('find')
  async find(
    @Query() querys: QueryType<FingerprintAPI['list']>,
  ): Promise<FingerprintAPI['list']['response']> {
    const result = this.fingerprintService.find(querys);
    return result;
  }

  @Post('find-building')
  async findBuilding(
    @Body() body: FingerprintAPI['findBuilding']['body'],
  ): Promise<FingerprintAPI['findBuilding']['response']> {
    return this.fingerprintService.findBuilding(body.apList);
  }
}
