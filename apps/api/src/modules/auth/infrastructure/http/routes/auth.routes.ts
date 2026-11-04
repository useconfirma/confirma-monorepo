import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from '../../../../../shared/infrastructure/http/middlewares/authenticate.middleware.js';
import { acceptInvitationController } from '../controllers/accept-invitation.controller.js';
import { getCurrentUserController } from '../controllers/get-current-user.controller.js';
import { loginController } from '../controllers/login.controller.js';
import { logoutController } from '../controllers/logout.controller.js';
import { requestInvitationController } from '../controllers/request-invitation.controller.js';
import { verifyInvitationController } from '../controllers/verify-invitation.controller.js';

export const authRoutes = Router();

authRoutes.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas solicitações. Tente novamente mais tarde.',
    },
  }),
);

authRoutes.post('/invitations', requestInvitationController);
authRoutes.get('/invitations/:invitationToken', verifyInvitationController);
authRoutes.post('/accounts', acceptInvitationController);
authRoutes.post('/sessions', loginController);
authRoutes.delete('/sessions/current', authenticate, logoutController);
authRoutes.get('/users/me', authenticate, getCurrentUserController);
