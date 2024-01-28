declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "production" | "development"

            DB_URL: string
            DB_NAME: string
        }
    }
}

export { }
