import { Fingerprint } from '../entities/fingerprint';

export namespace FingerprintDTO {
  export type Register = Pick<
    Fingerprint,
    'buildingId' | 'markerId' | 'signals'
  >;
}
