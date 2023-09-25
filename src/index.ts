import "dotenv/config";
import "./schedules";
import { startBot } from "./service/TelegramBot";
import { logging } from "./utils/logger";

startBot();

if (process.env.STOP_APP) {
    logging("Sistema foi solicitado a desligar.");
    process.exit(0);
}
