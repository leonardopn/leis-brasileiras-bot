import { createReadStream } from "fs";
import TelegramBot from "node-telegram-bot-api";
import path from "path";
import { v4 } from "uuid";
import { downloadPlanaltoLaw } from "../../utils/Puppeteer";

export function startBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN as string;

    const bot = new TelegramBot(token, { polling: true });

    bot.on("message", async (msg) => {
        try {
            bot.sendMessage(msg.chat.id, `Buscando lei: ${msg.text}`);
            const filePath = path.join(__dirname, "..", "..", "temp", `${v4()}.pdf`);
            const isCompleted = await downloadPlanaltoLaw(msg.text || "", filePath);

            if (isCompleted) {
                bot.sendDocument(
                    msg.chat.id,
                    createReadStream(filePath),
                    { caption: `Lei ${msg.text} baixada com sucesso!` },
                    { filename: `Lei ${msg.text}.pdf` }
                );
            } else {
                bot.sendMessage(
                    msg.chat.id,
                    `Não conseguimos localizar a lei ${msg.text}. Tente uma nova busca com mais informações.`
                );
            }
        } catch (error) {
            bot.sendMessage(
                msg.chat.id,
                "Tivemos um problema para processar sua operação. Tente novamente mais tarde."
            );
        }
    });
}
