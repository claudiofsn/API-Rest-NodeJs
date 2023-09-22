import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new RegisterUseCase(usersRepository);
    });

    it('should be able to register', async () => {
        const { user } = await sut.execute({
            name: 'Jhon Doe',
            email: 'jhon.doe@teste.com.br',
            password: '123456',
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it('should has user password uppon registration', async () => {
        const { user } = await sut.execute({
            name: 'Jhon Doe',
            email: 'jhon.doe@teste.com.br',
            password: '123456',
        });

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash,
        );

        expect(isPasswordCorrectlyHashed);
    });

    it('should not be able to register with same email twice', async () => {
        const email = 'johndoe@example.com';

        await sut.execute({
            name: 'Jhon Doe',
            email,
            password: '123456',
        });

        expect(
            async () =>
                await sut.execute({
                    name: 'Jhon Doe',
                    email,
                    password: '123456',
                }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
