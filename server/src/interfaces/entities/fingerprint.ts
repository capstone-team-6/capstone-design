export type APSignal = {
  BSSID: string;
  SSID: string;
  level: number;
};

export type Fingerprint = {
  buildingId: string;
  markerId: string;
  signals: APSignal[];
  registered_at: number;
};
