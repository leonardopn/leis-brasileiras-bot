import Fastify from "fastify";
import fs from "fs";
import path from "path";

const fastify = Fastify({
    logger: false,
    http2: true,
    https: {
        allowHTTP1: true,
        key: fs.readFileSync(path.join(__dirname, "https", "fastify.key")),
        cert: fs.readFileSync(path.join(__dirname, "https", "fastify.cert")),
    },
});

fastify.get("/", async function handler(request, reply) {
    return "Hello world";
});

export async function startApiServer() {
    try {
        await fastify.listen({ port: 8080 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
