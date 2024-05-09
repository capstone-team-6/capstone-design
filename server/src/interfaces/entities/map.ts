export type Floor = {
  floorId: string; // unique
  floorName: string;
  mapImageURL: string; // 특정 빌딩의 특정 층을 나타내는 지도 이미지 URL
  QRMarker: Marker[]; // QR code를 나타내는 마커
  nodeMarker: Marker[]; // 길 찾기를 위한 노드를 나타내는 마커
};

export type Marker = {
  markerId: string; // unique
  markerName: string;
  xLocation: number;
  yLocation: number;
  nearNodeId: string[]; // 인접 노드들의 id들
};

export type Building = {
  buildingId: string; // unique
  buildingName: string;
  floors: Floor[];
};
