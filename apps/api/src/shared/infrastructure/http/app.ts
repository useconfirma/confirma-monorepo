import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { buildOpenApiDocument } from './docs/openapi.js';
import { errorMiddleware } from './middleware/errors.middleware.js';
import { routes } from './routes.js';

export const app = express();

const { openApiDocument } = buildOpenApiDocument();

app.use(express.json());
app.use(cookieParser());

app.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'not_found', message: 'Recurso não encontrado.' } });
});

app.use(routes);

app.use(errorMiddleware);
