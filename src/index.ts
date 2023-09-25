import "dotenv/config";
import "./schedules";
import { startBot } from "./service/TelegramBot";

startBot();
