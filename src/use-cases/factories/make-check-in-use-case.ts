import { PrimsaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CheckInUseCase } from '../checkin';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';

export function makeCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository();
    const gymsRepository = new PrimsaGymsRepository()
    const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);

    return useCase;
}
