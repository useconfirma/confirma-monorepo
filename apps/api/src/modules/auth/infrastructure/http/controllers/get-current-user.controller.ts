import type { Request, Response } from 'express';
import { GetCurrentUserUseCase } from '../../../application/usecases/get-current-user.usecase.js';
import { PrismaUserRepository } from '../../repositories/prisma/prisma-user.repository.js';

const getCurrentUser = new GetCurrentUserUseCase(new PrismaUserRepository());

export const getCurrentUserController = async (req: Request, res: Response) => {
    const user = await getCurrentUser.execute({
        userId: req.userId!,
    });

    return res.status(200).json({
        user: { id: user.id, email: user.email },
    });
};
