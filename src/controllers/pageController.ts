import { Request, Response } from 'express';
import { getPageData } from '../services/pageService';
import { CONCURRENCY } from '../constants';

export interface PageData {
    title: string;
    description: string | null;
    screenshot?: string; // Base64 encoded image string
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
    const concurrency = parseInt(CONCURRENCY);

    try {
        const pages: PageData[] = await getPageData(urls, takeScreenshots, concurrency);

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