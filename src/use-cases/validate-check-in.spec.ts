import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-in-error';
import { MaxDistanceError } from './errors/max-distance-error';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInRepository);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to validate the check in', async () => {

        const createdCheckIn = await checkInRepository.create({
            gym_id: 'gym_01',
            user_id: 'user-01'
        })

        await sut.execute({
            checkInId: createdCheckIn.id
        });

        expect(createdCheckIn.validated_at).toEqual(expect.any(Date));
        expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
    });

    it('should not be able to validate an inexistent check-in', async () => {
        await expect(async () => {
            await sut.execute({
                checkInId: 'inexistent check-in id'
            })
        }).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it('should not be able to validade after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createdCheckIn = await checkInRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const twentyOneMinutesInMilisseconds = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMilisseconds);

        await expect(async () => await sut.execute({
            checkInId: createdCheckIn.id
        })).rejects.toBeInstanceOf(LateCheckInValidationError)
    });
});
