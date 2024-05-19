import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { MapAPI } from 'src/interfaces/endpoints/map';
import { QueryType } from 'src/interfaces/endpoints/type';
import { MapService } from './map.service';

@Controller('/api/map')
export class MapController {
  // 생성자
  constructor(
    @Inject(MapService) private mapService: MapService, // 의존성 주입
  ) {}

  @Post('building') // 빌딩 정보 등록
  async registerBuilding(
    @Body() body: MapAPI['registerBuilding']['body'],
  ): Promise<MapAPI['registerBuilding']['response']> {
    return this.mapService.registerBuilding(body);
  }

  @Get('building') // 길찾기 위한 노드 마커 찾기
  async findBuilding(
    @Query() querys: QueryType<MapAPI['findBuilding']>,
  ): Promise<MapAPI['findBuilding']['response']> {
    return this.mapService.FindBuilding(querys);
  }

  @Post('floor') // 층 정보 등록
  async registerFloor(
    @Body() body: MapAPI['registerFloor']['body'],
  ): Promise<MapAPI['registerFloor']['response']> {
    return this.mapService.registerFloor(body);
  }

  @Post('qr-marker') // QR 마커 등록
  async registerQRMarker(
    @Body() body: MapAPI['registerQRMarker']['body'],
  ): Promise<MapAPI['registerQRMarker']['response']> {
    return this.mapService.registerQRMarker(body);
  }

  @Post('node-marker') // 길찾기 위한 노드 마커 등록
  async registerNodeMarker(
    @Body() body: MapAPI['registerNodeMarker']['body'],
  ): Promise<MapAPI['registerNodeMarker']['response']> {
    return this.mapService.registerNodeMarker(body);
  }

  @Post('combine-node') // 길찾기 위한 인접 노드 등록
  async combineNearNode(
    @Body() body: MapAPI['combineNearNode']['body'],
  ): Promise<MapAPI['combineNearNode']['response']> {
    return this.mapService.combineNearNode(body);
  }

  @Post('marker-name') // 마커 이름 업데이트
  async updateMarkerName(
    @Body() body: MapAPI['updateMarkerName']['body'],
  ): Promise<MapAPI['updateMarkerName']['response']> {
    return this.mapService.updateMarkerName(body);
  }
}
