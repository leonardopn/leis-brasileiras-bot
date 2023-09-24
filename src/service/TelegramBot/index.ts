import { createReadStream } from "fs";
import TelegramBot from "node-telegram-bot-api";
import path from "path";
import { v4 } from "uuid";
import { downloadPlanaltoLaw } from "../../utils/Puppeteer";
import { logging } from "../../utils/logger";

export class SingletonTelegramBot extends TelegramBot {
    private static instance: SingletonTelegramBot;

    public static getInstance(): SingletonTelegramBot {
        if (!SingletonTelegramBot.instance) {
            SingletonTelegramBot.instance = new SingletonTelegramBot();
        }

        return SingletonTelegramBot.instance;
    }

    constructor() {
        const token = process.env.TELEGRAM_BOT_TOKEN as string;

        super(token, { polling: true });
    }
}

export function startBot() {
    let errorCount = 0;
    const bot = SingletonTelegramBot.getInstance();
    logging("Bot do telegram iniciado.");

    bot.on("text", async (msg) => {
        try {
            if (msg.text === "/start") {
                bot.sendMessage(
                    msg.chat.id,
                    "Seja bem vindo ao bot <b>Leis Brasileiras</b>. Estou aqui para te fornecer um acervo sobre todas as leis do Brasil.\n\nPara começar, basta digitar o número da lei e te trarei um arquivo PDF com seu conteúdo.",
                    { parse_mode: "HTML" }
                );
                return;
            }

            const filePath = path.join(__dirname, "..", "..", "temp", `${v4()}.pdf`);
            const isCompleted = await downloadPlanaltoLaw(msg.text || "", filePath, msg.chat.id);

            if (isCompleted) {
                bot.sendDocument(
                    msg.chat.id,
                    createReadStream(filePath),
                    { caption: `Lei ${msg.text} baixada com sucesso!` },
                    { filename: `Lei ${msg.text}.pdf` }
                );
            }
        } catch (error) {
            bot.sendMessage(
                msg.chat.id,
                "Tivemos um problema para processar sua operação. Tente novamente mais tarde."
            );
        }
    });

    bot.on("polling_error", async (error) => {
        errorCount += 1;
        logging(`Um erro correu durante o polling: ${error}`);

        if (errorCount === 10) {
            errorCount = 0;
            logging("Muitos erros de polling ocorreram, vamos aguardar 3 minutos e tentaremos novamente.");
            bot.stopPolling();
            setTimeout(() => bot.startPolling({ polling: true }), 180000); //NOTE: 3 minutos
        }
    });

    bot.on("error", async (error) => {
        logging(`Um erro critico aconteceu reinicie o sistema: ${error}`);
        process.exit(1);
    });
}
