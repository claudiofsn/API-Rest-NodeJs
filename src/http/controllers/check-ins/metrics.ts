import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function metrics(
    request: FastifyRequest,
    response: FastifyReply,
) {
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()

    const { checkInsCount } = await getUserMetricsUseCase.execute({
        userId: request.user.sub
    });

    return response.status(201).send({
        checkInsCount
    });
}