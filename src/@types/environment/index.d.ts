export type DefaultEnvs = {
    NODE_ENV: "development" | "production";
    TELEGRAM_BOT_TOKEN: string;
    NTBA_FIX_350: 1 | 0;
    STOP_APP: boolean;
};

declare global {
    namespace NodeJS {
        interface ProcessEnv extends DefaultEnvs {}
    }
}

export {};
