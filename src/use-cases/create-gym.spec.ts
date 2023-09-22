import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, expect, describe, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: "Hulk esmaga porra",
            description: null,
            phone: null,
            longitude: -21.0740076,
            latitude: -47.3124573,
        })

        expect(gym.id).toEqual(expect.any(String))

    })

})