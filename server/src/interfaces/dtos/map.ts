import { Building, Floor, Marker } from '../entities/map';

export namespace MarkerDTO {
  export type Register = {
    buildingId: Building['buildingId'];
    floorId: Floor['floorId'];
    marker: Omit<Marker, 'markerId'>;
  };

  export type CombineNode = {
    firstNode: Marker['markerId'];
    secondNode: Marker['markerId'];
  };

  export type UpdateName = Pick<Marker, 'markerId' | 'markerName'>;
}

export namespace BuildingDTO {
  export type RegisterBuilding = Pick<Building, 'buildingName'>;

  export type RegisterFloor = {
    floor: Pick<Floor, 'floorName' | 'mapImageURL'>;
    buildingId: Building['buildingId'];
  };
}
