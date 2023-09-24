import { Page } from "puppeteer";
import { newBrowserInstance } from "../../service/Puppeteer";

export async function downloadPagePdf(page: Page, filePath: string) {
    try {
        console.log("Baixando o pdf da página...");
        await page.pdf({ path: filePath, format: "A4" });
        console.log(`O site foi salvo como ${filePath}`);
    } catch (error) {
        console.error("Erro ao salvar o site como PDF:", error);
        throw error;
    }
}

export async function searchALawLinkInPage(page: Page, law: string) {
    try {
        console.log(`Buscando lei: ${law}`);
        await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(`lei ${law}`)}`);
        await page.waitForSelector("a.result__url");

        const resultUrl = await page.evaluate(() => {
            const linkElement = document.querySelector("a.result__url") as HTMLAnchorElement | null;
            return linkElement ? linkElement.href : null;
        });

        return resultUrl;
    } catch (error) {
        console.error(`Erro ao buscar lei ${law}`, error);
        throw error;
    }
}

export async function downloadPlanaltoLaw(law: string, pathToSavePdf: string) {
    const browser = await newBrowserInstance();
    const page = await browser.newPage();

    try {
        const resultUrl = await searchALawLinkInPage(page, law);

        if (resultUrl && resultUrl.includes("planalto.gov.br")) {
            await page.goto(resultUrl, { waitUntil: "networkidle2" });
            await downloadPagePdf(page, pathToSavePdf);
            return true;
        } else {
            console.log("Lei não localizada");
            return false;
        }
    } catch (error) {
        console.error(`Erro na operação total de download da lei ${law}:`, error);
        throw error;
    } finally {
        await browser.close();
    }
}
