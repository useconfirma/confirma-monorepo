import {
  extendZodWithOpenApi,
  OpenApiGeneratorV31,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const buildOpenApiDocument = () => {
  const registry = new OpenAPIRegistry();

  const openApiDocument = new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Confirma API',
      version: '0.0.0',
    },
  });

  return {
    registry,
    openApiDocument,
  };
};
