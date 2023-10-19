import { CreateGymUseCase } from '../create-gym';
import { PrimsaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeCreateGymUseCase() {
    const gymsRepository = new PrimsaGymsRepository();
    const useCase = new CreateGymUseCase(gymsRepository);

    return useCase;
}
