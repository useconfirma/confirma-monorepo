import { Router } from 'express';
import { accountsRoutes } from '../../../modules/accounts/infrastructure/http/routes/accounts.routes.js';
import { authRoutes } from '../../../modules/auth/infrastructure/http/routes/auth.routes.js';

export const routes = Router();

routes.use(authRoutes);
routes.use(accountsRoutes);
