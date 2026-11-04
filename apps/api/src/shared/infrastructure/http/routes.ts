import { Router } from 'express';
import { accountsRoutes } from '../../../modules/accounts/infrastructure/http/routes/accounts.routes.js';
import { authRoutes } from '../../../modules/auth/infrastructure/http/routes/auth.routes.js';
import { integrationsRoutes } from '../../../modules/integrations/infrastructure/http/routes/integrations.routes.js';

export const routes = Router();

routes.use(authRoutes);
routes.use(accountsRoutes);
routes.use(integrationsRoutes);
