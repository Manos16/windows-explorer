export const env = {
    port: Number(process.env.PORT ?? 3000),
    dbUrl: process.env.DATABASE_URL ?? "",
    nodeEnv: process.env.NODE_ENV ?? "development",
    jwtSecret: process.env.JWT_SECRET ?? "default_secret",
};
