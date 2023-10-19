import { SearchGymUseCase } from '../search-gyms';
import { PrimsaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeSearchGymsUseCase() {
    const gymsRepository = new PrimsaGymsRepository();
    const useCase = new SearchGymUseCase(gymsRepository);

    return useCase;
}
