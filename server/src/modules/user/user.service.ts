import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/entities/user';
import { DatabaseService } from '../util/database.service';

@Injectable()
export class UserService {
  constructor(@Inject(DatabaseService) private db: DatabaseService) {}

  async createUser(param: Pick<User, 'id' | 'name' | 'type'>): Promise<User> {
    const user: User = {
      ...param,
      group: [],
    };
    const result = await this.db.users.insertOne(user);

    if (result.acknowledged === false) {
      throw new Error('Failed to insert user');
    }

    return user;
  }

  async getUser(id: string): Promise<null | User> {
    const user: User | null = await this.db.users.findOne<User>({ id });
    return user;
  }

  async getUsers(ids: string[]): Promise<User[]> {
    return this.db.users.find({ id: { $in: ids } }).toArray();
  }

  async pairUser(a: string, b: string) {
    await this.db.withTransaction(async () => {
      const [userA, userB] = await Promise.all([
        this.db.users.findOne({ id: a }),
        this.db.users.findOne({ id: b }),
      ]);

      if (userA.type === userB.type) {
        throw new Error('Cannot pair users with same type: ' + userA.type);
      }

      const result = await Promise.all([
        this.db.users.updateOne(
          { id: a },
          { $set: { group: [...userA.group, b] } },
          {},
        ),
        this.db.users.updateOne(
          { id: b },
          { $set: { group: [...userB.group, a] } },
          {},
        ),
      ]);

      if (result.some((r) => !r.acknowledged)) {
        throw new Error('Failed to update user');
      }
    });
  }
}
