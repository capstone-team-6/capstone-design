import { BuildingDTO, MarkerDTO } from '../dtos/map';
import { Building } from '../entities/map';
import { DefineAPI } from './type';

export type MapAPI = DefineAPI<{
  // 빌딩 정보 등록
  registerBuilding: {
    method: 'POST';
    basePath: '/api/map';
    path: 'building';
    body: BuildingDTO.RegisterBuilding;
    response: Building;
  };

  // 특정 빌딩 정보 가져오기
  findBuilding: {
    method: 'GET';
    basePath: '/api/map';
    path: 'building';
    body: void;
    query: ['buildingId'];
    response: Building;
  };

  // 층 정보 등록
  registerFloor: {
    method: 'POST';
    basePath: '/api/map';
    path: 'floor';
    body: BuildingDTO.RegisterFloor;
    response: Building;
  };

  // QR 마커 등록
  registerQRMarker: {
    method: 'POST';
    basePath: '/api/map';
    path: 'qr-marker';
    body: MarkerDTO.Register;
    response: Building;
  };

  // 노드 마커 등록
  registerNodeMarker: {
    method: 'POST';
    basePath: '/api/map';
    path: 'node-marker';
    body: MarkerDTO.Register;
    response: Building;
  };

  // 인접 노드 등록
  combineNearNode: {
    method: 'POST';
    basePath: '/api/map';
    path: 'combine-node';
    body: MarkerDTO.CombineNode;
    response: Building;
  };

  // 마커 이름 업데이트
  updateMarkerName: {
    method: 'POST';
    basePath: '/api/map';
    path: 'marker-name';
    body: MarkerDTO.UpdateName;
    response: Building;
  };
}>;
