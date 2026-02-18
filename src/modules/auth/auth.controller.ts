import { Elysia, t } from 'elysia'
import { authService } from './auth.service'
import { accessJwt, refreshJwt } from '../../plugins/jwt'
import { response } from '../../utils/response'

export const authController = new Elysia({ prefix: '/auth' })
    .use(accessJwt)
    .use(refreshJwt)
    .post('/register', async ({ body }) => {
        const user = await authService.register(body)
        return response.success(user, 'User registered successfully')
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ minLength: 6 }),
            name: t.Optional(t.String())
        })
    })
    .post('/login', async ({ body, accessJwt, refreshJwt }) => {
        const user = await authService.login(body)

        const accessToken = await accessJwt.sign({ id: user.id, role: user.role })
        const refreshToken = await refreshJwt.sign({ id: user.id })

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await authService.saveRefreshToken(user.id, refreshToken, expiresAt)

        return response.success({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            accessToken,
            refreshToken
        }, 'Login successful')
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String()
        })
    })
    .post('/refresh', async ({ body, accessJwt, refreshJwt }) => {
        const decoded = await refreshJwt.verify(body.refreshToken)
        if (!decoded) throw new Error('Invalid refresh token')

        const newAccessToken = await accessJwt.sign({ id: (decoded as any).id, role: (decoded as any).role })
        const newRefreshToken = await refreshJwt.sign({ id: (decoded as any).id })

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await authService.rotateRefreshToken(body.refreshToken, newRefreshToken, expiresAt)

        return response.success({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        }, 'Token refreshed successfully')
    }, {
        body: t.Object({
            refreshToken: t.String()
        })
    })
