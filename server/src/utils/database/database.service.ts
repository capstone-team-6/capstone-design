import { Inject, Injectable } from "@nestjs/common";
import { Db, MongoClient } from "mongodb";
import { CLIENT, DB } from "./database.symbol";

@Injectable()
export class DatabaseService {
    constructor(
        @Inject(CLIENT) private client: MongoClient,
        @Inject(DB) private db: Db) { }
}