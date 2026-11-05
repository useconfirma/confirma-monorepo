import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from '../../../../../shared/infrastructure/http/middlewares/authenticate.middleware.js';
import { authorizeAccount } from '../../../../../shared/infrastructure/http/middlewares/authorize-account.middleware.js';
import { getAccountController } from '../controllers/get-account.controller.js';

export const accountsRoutes = Router();

accountsRoutes.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 120,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Muitas solicitações. Tente novamente mais tarde.',
        },
    }),
);

accountsRoutes.use(authenticate);
accountsRoutes.use(authorizeAccount);

accountsRoutes.get('/account', getAccountController);
