import pLimit from "p-limit";
import { chromium, Page } from "playwright";
import { PageData } from "../controllers/pageController"

export async function getPageData(urls: string[], takeScreenshots: boolean, maxConcurrency: number): Promise<PageData[]> {

    // Guard against overloading resources by enforcing max concurrency
    const limit = pLimit(maxConcurrency);
    
    const browser = await chromium.launch();
    const context = await browser.newContext();

    const pageDataPromises = urls.map(url => 
        limit(async () => {
            // Navigate to the url
            const page = await context.newPage();

            try {
                await page.goto(url, {timeout: 15000});
            } catch (error) {
                console.log('Error')
                return {
                    status: "Error",
                    message: (error instanceof Error) ? error.message : "Timed out while waiting for the page",
                    title: null,
                    description: null,
                    screenshot: null,
                    url,
                }
            }

            // Get page data using Playwright
            const title = await page.title();
            const metaDescription = await getLocatorText(page, 'meta[name="description"]', 5000);
            let screenshot: string | null = null;
            if (takeScreenshots) {
                const buffer = await page.screenshot();
                screenshot = buffer.toString("base64");
            }
            await page.close();

            return {
                status: "Success",
                message: "Successfully retrieved the page data",
                title,
                description: metaDescription,
                screenshot,
                url,
            } 
        })
    );

    // Wait for all promises to finish
    const results = await Promise.all(pageDataPromises);

    await browser.close();

    return results
}

async function getLocatorText(page: Page, selector: string, timeout: number): Promise<string | null> {
    let text: string | null = null;
    
    try {
        const metaDescriptionLocator = page.locator(selector);
        await metaDescriptionLocator.waitFor({ state: 'attached' });
        text = await metaDescriptionLocator.getAttribute("content", {
            timeout,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }

    return text;
}