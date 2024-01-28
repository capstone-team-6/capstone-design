import { Inject } from "@nestjs/common";
import { Cat } from "src/core/entities/cat";
import { DatabaseService } from "src/utils/database/database.service";

export class CatService {
    constructor(@Inject(DatabaseService) private db: DatabaseService) { }

    async findByName(name: string): Promise<Cat | null> {
        return this.db.cat.findOne({ name })
    }

    async create(cat: Cat): Promise<void> {
        await this.db.cat.insertOne(cat)
        return
    }
}