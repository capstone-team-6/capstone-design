import { FingerprintDTO } from '../dtos/fingerprint';
import { Fingerprint } from '../entities/fingerprint';
import { DefineAPI } from './type';

export type FingerprintAPI = DefineAPI<{
  basePath: '/api/fingerprint';
  endpoints: {
    register: {
      method: 'POST';
      path: 'register';
      body: FingerprintDTO.Register;
      response: Fingerprint;
    };
    find: {
      method: 'GET';
      path: 'find';
      query: ['buildingId', 'markerId'];
      response: Fingerprint[];
    };
  };
}>;
