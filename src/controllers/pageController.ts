import { Request, Response } from 'express';
import { getPageData } from '../services/pageService';
import { MAX_CONCURRENCY } from '../constants';

export interface PageData {
    status: string,
    message: string,
    title: string | null;
    description: string | null;
    screenshot: string | null; // Base64 encoded image string
    url: string,
}

interface GetPagesRequest {
    urls: string[];
    takeScreenshots: boolean;
}

interface GetPagesResponse {
    status: string;
    data: PageData[];
    validation: string[];
}

interface ErrorResponse {
    status: string;
    message: string;
}

export async function getPages (req: Request<{}, {}, GetPagesRequest>, res: Response<GetPagesResponse|ErrorResponse>) {
    const { urls, takeScreenshots } = req.body;
    const maxConcurrency = parseInt(MAX_CONCURRENCY);

    try {
        const pages: PageData[] = await getPageData(urls, takeScreenshots, maxConcurrency);

        const pagesPayload: GetPagesResponse = {
            status: "Success",
            data: pages,
            validation: [],
        }

        res.status(200).json(pagesPayload);
    } catch (err) {
        console.error(err);

        const errorPayload: ErrorResponse = {
            status: "Error",
            message: "Failed to track pages"
        }

        res.status(500).json(errorPayload);
    }
}