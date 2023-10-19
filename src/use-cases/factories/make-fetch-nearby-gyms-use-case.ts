import { FetchNearbyGymUseCase } from '../fetch-nearby-gyms';
import { PrimsaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';

export function makeFetchNearbyGymsUseCase() {
    const gymsRepository = new PrimsaGymsRepository();
    const useCase = new FetchNearbyGymUseCase(gymsRepository);

    return useCase;
}
