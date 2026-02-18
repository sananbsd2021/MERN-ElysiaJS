import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const accessJwt = new Elysia().use(
    jwt({
        name: 'accessJwt',
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
        exp: '15m'
    })
)

export const refreshJwt = new Elysia().use(
    jwt({
        name: 'refreshJwt',
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
        exp: '7d'
    })
)
