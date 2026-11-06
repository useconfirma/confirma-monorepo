import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { openApiRegistry } from './docs/openapi.js';
import { errorMiddleware } from './middlewares/errors.middleware.js';
import { routes } from './routes.js';

export const app = express();

const openApiDocument = new OpenApiGeneratorV31(
    openApiRegistry.definitions,
).generateDocument({
    openapi: '3.1.0',
    info: { title: 'Confirma API', version: '0.0.0' },
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(routes);

app.use((_req, res) => {
    res.status(404).json({
        error: { code: 'not_found', message: 'Recurso não encontrado.' },
    });
});

app.use(errorMiddleware);
