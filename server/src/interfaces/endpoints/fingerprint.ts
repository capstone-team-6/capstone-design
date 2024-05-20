import { FingerprintDTO } from '../dtos/fingerprint';
import { APSignal, Fingerprint } from '../entities/fingerprint';
import { DefineAPI } from './type';

export type FingerprintAPI = DefineAPI<{
  register: {
    method: 'POST';
    basePath: '/api/fingerprint';
    path: 'register';
    body: FingerprintDTO.Register;
    response: Fingerprint;
  };
  list: {
    method: 'GET';
    basePath: '/api/fingerprint';
    path: 'find';
    body: void;
    query: ['buildingId', 'markerId'];
    response: Fingerprint[];
  };
  findBuilding: {
    method: 'POST';
    basePath: '/api/fingerprint';
    path: 'find-building';
    body: {
      apList: APSignal[];
    };
    response: string;
  };
}>;
