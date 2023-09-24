import { readdir, unlink } from "fs";
import cron from "node-cron";
import path from "path";
import { logging } from "../../utils/logger";

const clearTempFiles = cron.schedule("*/5 * * * *", () => {
    logging("Rodando schedule `clearTempFile`");
    //NOTE: A cada 5 minutos
    const tempFolderPath = path.join(__dirname, "..", "..", "temp");

    readdir(tempFolderPath, (err, files) => {
        if (err) {
            logging(`Erro ao ler a pasta temp: ${err}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(tempFolderPath, file);

            unlink(filePath, (err) => {
                if (err) {
                    logging(`Erro ao excluir o arquivo: ${err}`);
                    return;
                }

                logging(`Arquivo excluído com sucesso: ${file}`);
            });
        });
    });
    logging("Schedule `clearTempFile` terminou");
});

export default { clearTempFiles };
