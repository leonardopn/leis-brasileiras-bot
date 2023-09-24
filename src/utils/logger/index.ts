import dayjs from "dayjs";
import { SingletonTelegramBot } from "../../service/TelegramBot";

export function logging(message: string, chatId?: number) {
    const now = dayjs();

    console.log(`[${now.format("DD/MM/YYYY HH:mm:ss")}] - ${message}`);

    if (chatId) {
        SingletonTelegramBot.getInstance().sendMessage(chatId, message);
    }
}
