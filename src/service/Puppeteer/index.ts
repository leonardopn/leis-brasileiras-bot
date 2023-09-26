import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export async function newBrowserInstance() {
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath("/opt/chromium"),
        headless: chromium.headless,
    });
    return browser;
}
