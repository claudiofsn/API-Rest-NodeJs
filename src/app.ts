import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(appRoutes);

app.setErrorHandler((error, _, response) => {
    if (error instanceof ZodError) {
        return response
            .status(400)
            .send({ message: 'Validation Error.', issue: error.format() });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // Log to an external tool like DataDog/NewRelic/Sentry
    }

    return response.status(500).send({ message: 'Internal server error.' });
});
