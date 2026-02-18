import { Elysia } from 'elysia'
import { accessJwt } from '../plugins/jwt'
import { Role } from '@prisma/client'

export const authMiddleware = new Elysia()
    .use(accessJwt)
    .derive(async ({ accessJwt, headers }) => {
        const authHeader = headers['authorization']
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { user: null }
        }

        const token = authHeader.split(' ')[1]
        const user = await accessJwt.verify(token)

        return { user }
    })
    .macro(({ onBeforeHandle }) => ({
        isAuth(value: boolean) {
            if (!value) return
            onBeforeHandle(({ user, set }) => {
                if (!user) {
                    set.status = 401
                    return { success: false, message: 'Unauthorized' }
                }
            })
        },
        role(requiredRole: Role) {
            onBeforeHandle(({ user, set }) => {
                if (!user || (user as any).role !== requiredRole) {
                    set.status = 403
                    return { success: false, message: 'Forbidden: Insufficient permissions' }
                }
            })
        }
    }))
