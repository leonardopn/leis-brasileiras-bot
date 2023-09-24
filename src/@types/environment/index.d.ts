export type DefaultEnvs = {
    NODE_ENV: "development" | "production";
    TELEGRAM_BOT_TOKEN: string;
};

declare global {
    namespace NodeJS {
        interface ProcessEnv extends DefaultEnvs {}
    }
}

export {};
