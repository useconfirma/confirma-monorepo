import type { ErrorRequestHandler } from 'express';
import { AppError } from '../../../domain/errors/app-error.js';

// Express só reconhece error handlers com 4 parâmetros (o `next` precisa existir).

export const errorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof AppError) {
        console.warn({
            type: 'AppError',
            code: error.code,
            message: error.message,
            statusCode: error.statusCode,
            method: req.method,
            path: req.path,
        });

        res.status(error.statusCode).json({
            error: { code: error.code, message: error.message },
        });
        return;
    }

    console.warn({
        type: 'UnexpectedError',
        code: 'internal_server_error',
        message: error instanceof Error ? error.message : String(error),
        statusCode: 500,
        method: req.method,
        path: req.path,
    });

    res.status(500).json({
        error: {
            code: 'internal_server_error',
            message: 'Erro interno do servidor.',
        },
    });

    next();
};
