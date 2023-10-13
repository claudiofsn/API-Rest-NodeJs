import { FastifyInstance } from "fastify"
import request from "supertest"

export async function createAndAuthenticateUse(app: FastifyInstance) {
    await request(app.server)
        .post('/users')
        .send({
            name: 'Jhon DOe',
            email: 'jhon@gmail.com',
            password: '123456'
        })

    const authReponse = await request(app.server)
        .post('/sessions')
        .send({
            email: 'jhon@gmail.com',
            password: '123456'
        })

    const { token } = authReponse.body

    return {
        token
    }
}