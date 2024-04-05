import { Injectable } from '@nestjs/common';
import { Collection, Db, MongoClient } from 'mongodb';
import { Fingerprint } from 'src/interfaces/entities/fingerprint';

@Injectable()
export class DatabaseService {
  private client: MongoClient;
  private db: Db;

  public fingerprints: Collection<Fingerprint>;

  constructor() {
    this.client = new MongoClient(process.env.DB_URL);
    this.db = this.client.db(process.env.DB_NAME);

    this.fingerprints = this.db.collection('fingerprints');
  }
}
