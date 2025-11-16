import { Request, Response } from 'express';

interface PageData {
    title: string;
    description: string;
    screenshot?: string; // Base64 encoded image string
}

interface GetPagesRequest {
    urls: string[];
    take_screenshots: boolean;
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

export const getPages = (req: Request<{}, {}, GetPagesRequest>, res: Response<GetPagesResponse|ErrorResponse>) => {
    try {
        const pages: PageData[] = [
            { title: "Example Title", "description": "Example Description", "screenshot": "b64encodedstring" }
        ];

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