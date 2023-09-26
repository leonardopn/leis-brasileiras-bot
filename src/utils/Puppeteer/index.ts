import { Page } from "puppeteer-core";
import { newBrowserInstance } from "../../service/Puppeteer";
import { logging } from "../logger";

export async function downloadPagePdf(page: Page, filePath: string, chatId: number) {
    try {
        logging("Baixando o pdf da página...", chatId);

        await page.pdf({ path: filePath, format: "A4" });

        logging("Download completo!", chatId);

        logging(`O site foi salvo como ${filePath}`);
    } catch (error) {
        logging(`Erro ao salvar o site como PDF: ${error}`);
        throw error;
    }
}

export async function searchALawLinkInPage(page: Page, law: string, chatId: number) {
    try {
        logging(`Buscando lei: ${law}`, chatId);

        await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(`site:planalto.gov.br ${law}`)}`);
        await page.waitForSelector("a.result__url");

        const resultUrl = await page.evaluate(() => {
            const linkElement = document.querySelector("a.result__url") as HTMLAnchorElement | null;
            return linkElement ? linkElement.href : null;
        });

        return resultUrl;
    } catch (error) {
        logging(`Erro ao buscar lei ${law}: ${error}`);

        throw error;
    }
}

export async function downloadPlanaltoLaw(law: string, pathToSavePdf: string, chatId: number) {
    const browser = await newBrowserInstance();
    const page = await browser.newPage();

    try {
        const resultUrl = await searchALawLinkInPage(page, law, chatId);

        if (resultUrl && resultUrl.includes("planalto.gov.br")) {
            await page.goto(resultUrl, { waitUntil: "networkidle2" });
            await downloadPagePdf(page, pathToSavePdf, chatId);
            return true;
        } else {
            logging("Lei não localizada. Tente melhorar sua busca.", chatId);
            return false;
        }
    } catch (error) {
        logging(`Erro na operação total de download da lei ${law}: ${error}`);
        throw error;
    } finally {
        //FIX: Por algum motivo, está travando o app
        browser.close();
    }
}
