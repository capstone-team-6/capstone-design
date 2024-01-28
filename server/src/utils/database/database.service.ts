import { Inject, Injectable } from "@nestjs/common";
import { Collection, Db, MongoClient } from "mongodb";
import { Cat } from "src/core/entities/cat";
import { CollectionName } from "./database.collection";
import { CLIENT, DB } from "./database.symbol";

@Injectable()
export class DatabaseService {
    cat: Collection<Cat>

    constructor(
        @Inject(CLIENT) private client: MongoClient,
        @Inject(DB) private db: Db) {

        this.cat = this.db.collection(CollectionName.CAT)
    }
}