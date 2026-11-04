import { Router } from 'express';
import { authRoutes } from '../../../modules/auth/infrastructure/http/routes/auth.routes.js';

export const routes = Router();

routes.use(authRoutes);
