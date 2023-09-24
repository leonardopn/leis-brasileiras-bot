import puppeteer from "puppeteer";

export async function newBrowserInstance() {
    const browser = await puppeteer.launch({
        headless: "new",
    });
    return browser;
}
