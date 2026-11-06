import {
    extendZodWithOpenApi,
    OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { authenticate } from '../../../../../shared/infrastructure/http/middlewares/authenticate.middleware.js';
import { errorResponseSchema } from '../../../../../shared/infrastructure/schemas/zod/error.schema.js';
import {
    acceptInvitationRequestSchema,
    acceptInvitationResponseSchema,
} from '../../schemas/zod/accept-invitation.schema.js';
import { getCurrentUserResponseSchema } from '../../schemas/zod/get-current-user.schema.js';
import { loginRequestSchema } from '../../schemas/zod/login.schema.js';
import {
    requestInvitationRequestSchema,
    requestInvitationResponseSchema,
} from '../../schemas/zod/request-invitation.schema.js';
import {
    verifyInvitationRequestSchema,
    verifyInvitationResponseSchema,
} from '../../schemas/zod/verify-invitation.schema.js';
import { acceptInvitationController } from '../controllers/accept-invitation.controller.js';
import { getCurrentUserController } from '../controllers/get-current-user.controller.js';
import { loginController } from '../controllers/login.controller.js';
import { logoutController } from '../controllers/logout.controller.js';
import { requestInvitationController } from '../controllers/request-invitation.controller.js';
import { verifyInvitationController } from '../controllers/verify-invitation.controller.js';

extendZodWithOpenApi(z);

export const authOpenApiRegistry = new OpenAPIRegistry();

authOpenApiRegistry.registerPath({
    method: 'post',
    path: '/invitations',
    tags: ['Auth'],
    summary: 'Solicitar convite',
    request: {
        body: {
            content: {
                'application/json': { schema: requestInvitationRequestSchema },
            },
        },
    },
    responses: {
        202: {
            description: 'Convite aceito',
            content: {
                'application/json': { schema: requestInvitationResponseSchema },
            },
        },
        400: {
            description: 'Corpo inválido',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

authOpenApiRegistry.registerPath({
    method: 'get',
    path: '/invitations/{invitationToken}',
    tags: ['Auth'],
    summary: 'Verificar convite',
    request: { params: verifyInvitationRequestSchema },
    responses: {
        200: {
            description: 'Convite disponível',
            content: {
                'application/json': { schema: verifyInvitationResponseSchema },
            },
        },
        410: {
            description: 'Convite indisponível',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

authOpenApiRegistry.registerPath({
    method: 'post',
    path: '/accounts',
    tags: ['Auth'],
    summary: 'Aceitar convite e criar account',
    request: {
        body: {
            content: {
                'application/json': { schema: acceptInvitationRequestSchema },
            },
        },
    },
    responses: {
        201: {
            description: 'Account criada',
            content: {
                'application/json': { schema: acceptInvitationResponseSchema },
            },
        },
        409: {
            description: 'E-mail já cadastrado',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
        410: {
            description: 'Convite indisponível',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
        422: {
            description: 'Dados inválidos',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

authOpenApiRegistry.registerPath({
    method: 'post',
    path: '/sessions',
    tags: ['Auth'],
    summary: 'Entrar',
    request: {
        body: {
            content: { 'application/json': { schema: loginRequestSchema } },
        },
    },
    responses: {
        204: { description: 'Sessão criada' },
        401: {
            description: 'Credenciais inválidas',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

authOpenApiRegistry.registerPath({
    method: 'delete',
    path: '/sessions/current',
    tags: ['Auth'],
    summary: 'Sair',
    responses: {
        204: { description: 'Sessão encerrada' },
        401: {
            description: 'Sessão ausente ou inválida',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

authOpenApiRegistry.registerPath({
    method: 'get',
    path: '/users/me',
    tags: ['Auth'],
    summary: 'Consultar usuário atual',
    responses: {
        200: {
            description: 'Usuário consultado',
            content: {
                'application/json': { schema: getCurrentUserResponseSchema },
            },
        },
        401: {
            description: 'Sessão ausente ou inválida',
            content: { 'application/json': { schema: errorResponseSchema } },
        },
    },
});

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
