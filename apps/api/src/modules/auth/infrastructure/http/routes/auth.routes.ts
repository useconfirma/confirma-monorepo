import { Router } from 'express';
import { acceptInvitationController } from '../controllers/accept-invitation.controller.js';
import { getAccountController } from '../controllers/get-account.controller.js';
import { getCurrentUserController } from '../controllers/get-current-user.controller.js';
import { loginController } from '../controllers/login.controller.js';
import { logoutController } from '../controllers/logout.controller.js';
import { requestInvitationController } from '../controllers/request-invitation.controller.js';
import { verifyInvitationController } from '../controllers/verify-invitation.controller.js';

export const authRoutes = Router();

authRoutes.post('/invitations', requestInvitationController);
authRoutes.get('/invitations/:invitationToken', verifyInvitationController);
authRoutes.post('/accounts', acceptInvitationController);
authRoutes.post('/sessions', loginController);
authRoutes.delete('/sessions/current', logoutController);
authRoutes.get('/account', getAccountController);
authRoutes.get('/users/me', getCurrentUserController);
