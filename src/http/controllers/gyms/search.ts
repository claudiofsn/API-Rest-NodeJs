import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function search(
    request: FastifyRequest,
    response: FastifyReply,
) {
    const searchGymsParams = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { query, page } = searchGymsParams.parse(request.query);

    const searchGymsUseCase = makeSearchGymsUseCase();

    const { gyms } = await searchGymsUseCase.execute({
        query,
        page
    });

    return response.status(200).send({
        gyms
    });
}
