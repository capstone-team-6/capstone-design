import { Building, Marker, Floor } from '../entities/map';

export namespace MarkerDTO {
  export type Register = {
    buildingId: Building['buildingId'];
    floorId: Floor['floorId'];
    marker: Marker;
  };
}

export namespace BuildingDTO {
  export type RegisterBuilding = Pick<Building, 'buildingId' | 'buildingName'>;

  export type RegisterFloor = {
    floor: Pick<
      Floor,
      'floorId' | 'floorName' | 'mapImageURL'
    >;
    buildingId: Building['buildingId'];
  };
}
