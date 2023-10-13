import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function history(
    request: FastifyRequest,
    response: FastifyReply,
) {
    const checkInHistoryQueryParams = z.object({
        page: z.coerce.number().min(1).default(1),
    });

    const { page } = checkInHistoryQueryParams.parse(request.query);

    const searchGymsUseCase = makeFetchUserCheckInsHistoryUseCase();

    const { checkIns } = await searchGymsUseCase.execute({
        page,
        userId: request.user.sub
    });

    return response.status(201).send({
        checkIns
    });
}
