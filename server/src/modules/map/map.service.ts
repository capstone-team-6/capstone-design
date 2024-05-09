import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ReturnDocument } from 'mongodb';
import { Building, Floor, Marker } from 'src/interfaces/entities/map';
import { DatabaseService } from '../util/database.service';

@Injectable()
export class MapService {
  // 생성자
  constructor(
    @Inject(DatabaseService) private db: DatabaseService, // 의존성 주입
  ) {}

  async registerBuilding(
    buildingInfo: Pick<Building, 'buildingName'>,
  ): Promise<Building> {
    const document: Building = {
      buildingId: randomUUID(),
      ...buildingInfo,
      floors: [],
    }; // 삽입할 데이터

    const result = await this.db.building.insertOne(document);

    if (result.acknowledged === false) {
      throw new Error('Failed to insert new building');
    }

    return document;
  }

  async FindBuilding(
    filter: Partial<Pick<Building, 'buildingId'>>,
  ): Promise<Building> {
    const updatedBuilding: Building = await this.db.building.findOne(filter);

    return updatedBuilding;
  }

  async registerFloor(floorInfo: {
    floor: Pick<Floor, 'floorName' | 'mapImageURL'>;
    buildingId: Building['buildingId'];
  }): Promise<Building> {
    const document: Floor = {
      floorId: randomUUID(),
      ...floorInfo.floor,
      QRMarker: [],
      nodeMarker: [],
    }; // 삽입할 데이터

    const filter = { buildingId: floorInfo.buildingId }; // 빌딩 아이디로 find
    const update = { $push: { floors: document } }; // 추가할 마커
    const options = { returnDocument: ReturnDocument.AFTER };

    const updatedBuilding: Building = await this.db.building.findOneAndUpdate(
      filter,
      update,
      options,
    ); // update

    if (!updatedBuilding) {
      throw new Error('Failed to update floor');
    }

    return updatedBuilding;
  }

  async registerQRMarker(QRInfo: {
    buildingId: Building['buildingId'];
    floorId: Floor['floorId'];
    marker: Omit<Marker, 'markerId'>;
  }): Promise<Building> {
    const document: Marker = {
      markerId: randomUUID(),
      ...QRInfo.marker,
    };

    const filter = {
      buildingId: QRInfo.buildingId,
      'floors.floorId': QRInfo.floorId,
    }; // 빌딩 아이디와 층 아이디로 find
    const update = { $push: { 'floors.$.QRMarker': document } }; // 추가할 마커
    const options = { returnDocument: ReturnDocument.AFTER };

    const updatedBuilding: Building = await this.db.building.findOneAndUpdate(
      filter,
      update,
      options,
    ); // update

    if (!updatedBuilding) {
      throw new Error('Failed to update QR marker');
    }

    return updatedBuilding;
  }

  async registerNodeMarker(NodeInfo: {
    buildingId: Building['buildingId'];
    floorId: Floor['floorId'];
    marker: Omit<Marker, 'markerId'>;
  }): Promise<Building> {
    const document: Marker = {
      markerId: randomUUID(),
      ...NodeInfo.marker,
    };

    const filter = {
      buildingId: NodeInfo.buildingId,
      'floors.floorId': NodeInfo.floorId,
    }; // URL로 find
    const update = { $push: { 'floors.$.nodeMarker': document } }; // 추가할 마커
    const options = { returnDocument: ReturnDocument.AFTER };

    const updatedBuilding: Building = await this.db.building.findOneAndUpdate(
      filter,
      update,
      options,
    ); // update

    if (!updatedBuilding) {
      throw new Error('Failed to update node marker');
    }

    return updatedBuilding;
  }
}
