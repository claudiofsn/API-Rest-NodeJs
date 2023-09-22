import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-in-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInRepository, gymsRepository);
        vi.useFakeTimers();

        await gymsRepository.create({
            id: 'gym-01',
            title: 'HULCKÃO',
            description: 'Academia boa',
            phone: '169999999',
            longitude: 0,
            latitude: 0,
        })

    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice on the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        await expect(async () => {
            await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0,
            });
        }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it('should be able to check in twice in different same days', async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0,
        });

        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in on distant gym', async () => {

        gymsRepository.items.push({
            id: 'gym-02',
            title: 'HULCKÃO',
            description: 'Academia boa',
            phone: '169999999',
            longitude: new Decimal(-21.0740076),
            latitude: new Decimal(-47.3124573),
        });

        await expect(() => sut.execute({
            gymId: 'gym-02',
            userId: 'user-01',
            userLatitude: -19.0661101,
            userLongitude: -49.9477352,
        })).rejects.toBeInstanceOf(MaxDistanceError);
    });

});
