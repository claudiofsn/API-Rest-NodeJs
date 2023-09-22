import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymUseCase } from './search-gyms';

let gymsInRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsInRepository = new InMemoryGymsRepository();
        sut = new SearchGymUseCase(gymsInRepository);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to search for a gym', async () => {
        await gymsInRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: null,
            longitude: -21.0740076,
            latitude: -47.3124573
        })

        await gymsInRepository.create({
            title: 'Typescript Gym',
            description: null,
            phone: null,
            longitude: -21.0740076,
            latitude: -47.3124573,
        })

        const { gyms } = await sut.execute({ query: 'JavaScript', page: 1 });

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ])
    });

    it('should be able to fetch paginated gym search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsInRepository.create({
                title: `JavaScript Gym ${i}`,
                description: null,
                phone: null,
                longitude: -21.0740076,
                latitude: -47.3124573
            })
        }

        const { gyms } = await sut.execute({ query: 'JavaScript', page: 2 });

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ])
    });

});
