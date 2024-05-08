import { Building, Marker } from '../entities/map';

export namespace MarkerDTO {
  export type Register = {
    buildingId: Building['buildingId'];
    floorId: Building['floor'][number]['floorId'];
    marker: Marker;
  };
}

export namespace BuildingDTO {
  export type RegisterBuilding = Pick<Building, 'buildingId' | 'buildingName'>;

  export type RegisterFloor = {
    floor: Pick<
      Building['floor'][number],
      'floorId' | 'floorName' | 'mapImageURL'
    >;
    buildingId: Building['buildingId'];
  };
}
