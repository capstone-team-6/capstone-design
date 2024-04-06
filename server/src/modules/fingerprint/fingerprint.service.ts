import { Inject, Injectable } from '@nestjs/common';
import { Fingerprint } from 'src/interfaces/entities/fingerprint';
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
}
