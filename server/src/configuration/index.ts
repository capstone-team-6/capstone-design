import assert from "assert";
import { config } from "dotenv";
import path from "path";

export function loadDotEnv() {
    if (process.env.NODE_ENV === "development") {
        config({
            path: path.resolve(__dirname, "../../config/.development.env")
        })
    }
}

export function assertEnv() {
    assert.ok(process.env.DB_URL)
    assert.ok(process.env.DB_NAME)
}