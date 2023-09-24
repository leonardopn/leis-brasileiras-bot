import "dotenv/config";
import "./schedules";
import { startBot } from "./service/TelegramBot";
import { startApiServer } from "./service/api";

startBot();
startApiServer();
