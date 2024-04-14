import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, MongoClient } from 'mongodb';
import { Config } from 'src/configuration';
import { Fingerprint } from 'src/interfaces/entities/fingerprint';

@Injectable()
export class DatabaseService {
  private client: MongoClient;
  private db: Db;

  public fingerprints: Collection<Fingerprint>;

  constructor(private configService: ConfigService<Config>) {
    this.client = new MongoClient(this.configService.get('DB_URL'));
    this.db = this.client.db(this.configService.get('DB_NAME'));

    this.fingerprints = this.db.collection('fingerprints');
  }
}
