import { Module } from "@nestjs/common";
import { Db, MongoClient } from "mongodb";
import { DatabaseService } from "./database.service";
import { CLIENT, DB } from "./database.symbol";

@Module({
    providers: [{
        provide: CLIENT,
        useFactory: (): MongoClient => {
            return new MongoClient(process.env.DB_URL)
        },


    }, {
        inject: [CLIENT],
        provide: DB,
        useFactory: (client: MongoClient): Db => {
            return client.db(process.env.DB_NAME)
        }
    }, DatabaseService],
    exports: [DatabaseService]
})

export class DatabaseModule { }