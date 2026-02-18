import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { loggerMiddleware } from './middleware/logger'
import { errorHandler } from './middleware/error'
import { authController } from './modules/auth/auth.controller'
import { userController } from './modules/user/user.controller'
import { response } from './utils/response'

export const app = new Elysia({ prefix: '/api/v1' })
    .use(swagger({
        path: '/docs',
        documentation: {
            info: {
                title: 'ElysiaJS Backend API',
                version: '1.0.0',
                description: 'Production-ready backend with ElysiaJS, Prisma, and JWT'
            }
        }
    }))
    .use(cors())
    .use(loggerMiddleware)
    .use(errorHandler)
    .get('/health', () => response.success({ status: 'ok', uptime: process.uptime() }, 'Service is healthy'))
    .group('', (app) =>
        app.use(authController).use(userController)
    )
