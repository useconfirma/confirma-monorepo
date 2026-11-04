import { Router } from 'express';
import { configureSendWindowController } from '../controllers/configure-send-window.controller.js';
import { configureWebhookController } from '../controllers/configure-webhook.controller.js';
import { configureZApiController } from '../controllers/configure-z-api.controller.js';
import { generateApiKeyController } from '../controllers/generate-api-key.controller.js';
import { getAccountController } from '../controllers/get-account.controller.js';

export const accountsRoutes = Router();

accountsRoutes.get('/account', getAccountController);
accountsRoutes.put('/integration/send-window', configureSendWindowController);
accountsRoutes.post('/integration/api-key', generateApiKeyController);
accountsRoutes.put('/integration/webhook', configureWebhookController);
accountsRoutes.put('/integration/z-api', configureZApiController);
