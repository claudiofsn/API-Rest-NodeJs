import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';
import { ValidateCheckInUseCase } from '@/use-cases/validate-check-in';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function validate(
    request: FastifyRequest,
    response: FastifyReply,
) {

    const validate0CheckInParamsSchema = z.object({
        checkInId: z.string().uuid()
    })

    const { checkInId } = validate0CheckInParamsSchema.parse(request.params)

    const validateCheckInUseCase = makeValidateCheckInUseCase();

    await validateCheckInUseCase.execute({
        checkInId: checkInId
    });

    return response.status(204).send();
}
