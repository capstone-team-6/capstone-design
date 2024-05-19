import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, MongoClient } from 'mongodb';
import { Config } from 'src/configuration';
import { Fingerprint } from 'src/interfaces/entities/fingerprint';
import { Building } from 'src/interfaces/entities/map';
import { User } from 'src/interfaces/entities/user';

@Injectable()
export class DatabaseService {
  private client: MongoClient;
  private db: Db;

  public fingerprints: Collection<Fingerprint>;
  public building: Collection<Building>;
  public users: Collection<User>;

  constructor(private configService: ConfigService<Config>) {
    this.client = new MongoClient(this.configService.get('DB_URL'));
    this.db = this.client.db(this.configService.get('DB_NAME'));

    this.fingerprints = this.db.collection('fingerprints');
    this.building = this.db.collection('building');
    this.users = this.db.collection('users');
  }

  async withTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.client.withSession(async (session) => {
      session.startTransaction();

      const result = await callback();

      session.commitTransaction();

      return result;
    });
  }
}
