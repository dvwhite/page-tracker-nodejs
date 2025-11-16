import { Request, Response } from 'express';

interface PageData {
    title: string;
    description: string;
    screenshot: string; // Base64 encoded image string
}

export const getPages = (req: Request, res: Response) => {
    const pages: PageData[] = [
        { title: "Example Title", "description": "Example Description", "screenshot": "b64encodedstring" }
    ];

    res.json(pages);
}