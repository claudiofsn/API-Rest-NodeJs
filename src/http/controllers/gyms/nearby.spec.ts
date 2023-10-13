import { app } from '@/app'
import { createAndAuthenticateUse } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('Should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUse(app);

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description...',
                phone: '16999999999',
                latitude: -27.2092052,
                longitude: -49.6401091,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description...',
                phone: '16999999999',
                latitude: -27.0610928,
                longitude: -49.5229501,
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -27.2092052,
                longitude: -49.6401091,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()


        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym'
            })
        ])
    })
})