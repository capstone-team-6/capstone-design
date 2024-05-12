import { Building, Marker, Floor } from '../entities/map';

export namespace MarkerDTO {
  export type Register = {
    buildingId: Building['buildingId'];
    floorId: Floor['floorId'];
    marker: Omit<Marker, 'markerId'>;
  };
}

export namespace BuildingDTO {
  export type RegisterBuilding = Pick<Building, 'buildingName'>;

  export type RegisterFloor = {
    floor: Pick<
      Floor,
      'floorName' | 'mapImageURL'
    >;
    buildingId: Building['buildingId'];
  };
}
