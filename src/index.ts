import "dotenv/config";
import "./schedules";
import { startBot } from "./service/TelegramBot";
import { logging } from "./utils/logger";
import { startApiServer } from "./service/api";

startBot();
startApiServer();

if (Number(process.env.STOP_APP)) {
    logging("Sistema foi solicitado a desligar.");
    process.exit(0);
}
