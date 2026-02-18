import { Elysia } from 'elysia'
import pino from 'pino'

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})

export const loggerMiddleware = new Elysia()
    .onRequest(({ request }) => {
        logger.info({
            method: request.method,
            url: request.url,
            time: new Date().toISOString()
        }, 'Request started')
    })
    .onAfterResponse(({ request, set }) => {
        logger.info({
            method: request.method,
            url: request.url,
            status: set.status
        }, 'Request completed')
    })
