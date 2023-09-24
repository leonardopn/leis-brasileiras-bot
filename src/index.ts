import "dotenv/config";
import { startBot } from "./service/TelegramBot";
import { startApiServer } from "./service/api";

startBot();
startApiServer();
