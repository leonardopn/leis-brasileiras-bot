import Fastify from "fastify";
import { logging } from "../../utils/logger";
import dayjs from "dayjs";

const fastify = Fastify({
    logger: false,
});

fastify.get("/", async function handler() {
    return `${dayjs().format("DD/MM/YYYY HH:mm:ss")} - Leis brasileiras - BOT V1.0.0`;
});

export async function startApiServer() {
    try {
        logging("API iniciada na porta 8080.");
        await fastify.listen({ port: 8080 });
    } catch (err) {
        logging(`Erro na API: ${err}`);
        fastify.log.error(err);
        process.exit(1);
    }
}
