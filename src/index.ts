import express, { Application, Request, Response } from 'express';
import pageRoutes from './routes/pageRoutes';

const app: Application = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", pageRoutes);
app.get('/', (req: Request, res: Response) => {
    res.send({
        "status": "ok",
        "message": "API is up and running."
    })
});

// Avoid errors caused by importing in tests
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
}

export default app;