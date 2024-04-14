import { FingerprintDTO } from '../dtos/fingerprint';
import { Fingerprint } from '../entities/fingerprint';
import { DefineAPI } from './type';

export type FingerprintAPI = DefineAPI<{
  register: {
    method: 'POST';
    basePath: '/api/fingerprint';
    path: 'register';
    body: FingerprintDTO.Register;
    response: Fingerprint;
  };
  find: {
    method: 'GET';
    basePath: '/api/fingerprint';
    path: 'find';
    query: ['buildingId', 'markerId'];
    response: Fingerprint[];
  };
}>;
