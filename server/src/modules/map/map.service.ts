import { Inject, Injectable } from '@nestjs/common';
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
    buildingInfo: Pick<Building, 'buildingId' | 'buildingName'>,
  ): Promise<Building> {
    const document: Building = {
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
    const findMapImage: Building = await this.db.building.findOne(filter);

    return findMapImage;
  }

  async registerFloor(floorInfo: {
    floor: Pick<Floor, 'floorId' | 'floorName' | 'mapImageURL'>;
    buildingId: Building['buildingId'];
  }): Promise<Building> {
    const document: Floor = {
      ...floorInfo.floor,
      QRMarker: [],
      nodeMarker: [],
    }; // 삽입할 데이터

    const filter = { buildingId: floorInfo.buildingId }; // 빌딩 아이디로 find
    const update = { $push: { floor: document } }; // 추가할 마커
    const options = { returnDocument: ReturnDocument.AFTER };

    const updatedBuilding = await this.db.building.findOneAndUpdate(
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
    marker: Marker;
  }): Promise<boolean> {
    const filter = {
      buildingId: QRInfo.buildingId,
      'floor.floorId': QRInfo.floorId,
    }; // 빌딩 아이디와 층 아이디로 find
    const update = { $push: { 'floor.$.QRMarker': QRInfo.marker } }; // 추가할 마커
    const options = { returnDocument: ReturnDocument.AFTER };

    const updatedBuilding: Building = await this.db.building.findOneAndUpdate(
      filter,
      update,
      options,
    ); // update

    if (!updatedBuilding) {
      throw new Error('Failed to update QR marker');
    }

    return true;
  }

  async registerNodeMarker(NodeInfo: {
    buildingId: Building['buildingId'];
    floorId: Floor['floorId'];
    marker: Marker;
  }): Promise<boolean> {
    const filter = {
      buildingId: NodeInfo.buildingId,
      'floor.floorId': NodeInfo.floorId,
    }; // URL로 find
    const update = { $push: { 'floor.$.nodeMarker': NodeInfo.marker } }; // 추가할 마커
    const options = { returnDocument: ReturnDocument.AFTER };

    const updatedBuilding: Building = await this.db.building.findOneAndUpdate(
      filter,
      update,
      options,
    ); // update

    if (!updatedBuilding) {
      throw new Error('Failed to update node marker');
    }

    return true;
  }
}
