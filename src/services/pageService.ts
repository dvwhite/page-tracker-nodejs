import pLimit from "p-limit";
import { chromium, Page } from "playwright";
import { PageData } from "../controllers/pageController"

export async function getPageData(urls: string[], takeScreenshots: boolean, concurrencyLimit: number): Promise<PageData[]> {

    // Guard against overloading resources by enforcing max concurrency
    const limit = pLimit(concurrencyLimit);
    
    const browser = await chromium.launch();
    const context = await browser.newContext();

    const pageDataPromises = urls.map(url => 
        limit(async () => {
            // Navigate to the url
            const page = await context.newPage();
            await page.goto(url);

            // Get page data using Playwright
            const title = await page.title();
            const metaDescription = await getLocatorText(page, 'meta[name="description"]', 5);
            let screenshot: string = "";
            if (takeScreenshots) {
                const buffer = await page.screenshot({fullPage: true});
                screenshot = buffer.toString("base64");
            }
            await page.close();

            return {
                title,
                description: metaDescription,
                screenshot,
            } 
        })
    );

    // Wait for all promises to finish
    const results = await Promise.all(pageDataPromises);

    await browser.close();

    return results
}

async function getLocatorText(page: Page, locator: string, timeout: number): Promise<string | null> {
    let text: string | null = null;
    
    try {
        text = await page.locator(locator).textContent({
            timeout: timeout,
        });
    } catch (error) {
        console.log('Timeout!');
    }

    return text;
}