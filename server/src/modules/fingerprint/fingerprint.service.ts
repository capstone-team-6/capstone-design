import { Inject, Injectable } from '@nestjs/common';
import { APSignal, Fingerprint } from 'src/interfaces/entities/fingerprint';
import { DatabaseService } from '../util/database.service';

@Injectable()
export class FingerprintService {
  constructor(@Inject(DatabaseService) private db: DatabaseService) {}

  async register(fingerprint: Omit<Fingerprint, 'registered_at'>) {
    const document: Fingerprint = {
      ...fingerprint,
      registered_at: Date.now(),
    };

    const result = await this.db.fingerprints.insertOne(document);
    if (result.acknowledged === false) {
      throw new Error('Failed to insert new fingerprint');
    }

    return document;
  }

  async find(filter: Partial<Pick<Fingerprint, 'buildingId' | 'markerId'>>) {
    return await this.db.fingerprints.find(filter).toArray();
  }

  async findNearestMarker(buildingId: string, signals: APSignal[]) {
    const fingerprints = await this.db.fingerprints
      .find({ buildingId })
      .toArray();

    const idSet = new Set<string>([
      ...signals.map((signal) => signal.BSSID),
      // ...fingerprints
      //   .map((fingerprint) => fingerprint.signals.map((signal) => signal.BSSID))
      //   .flat(),
    ]);
    console.log(idSet);

    const MIN_RSSI = -100 as const;
    const result = fingerprints
      .map((fingerprint) => {
        let distance = 0;

        idSet.forEach((id) => {
          const a =
            fingerprint.signals.find((signal) => signal.BSSID === id)?.level ??
            MIN_RSSI;
          const b =
            signals.find((signal) => signal.BSSID === id)?.level ?? MIN_RSSI;

          console.log(a, b);
          distance += (a - b) * (a - b);
        });

        return {
          distance,
          markerId: fingerprint.markerId,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    // const K = 1;

    return {
      ...result[0],
    };
  }
}
