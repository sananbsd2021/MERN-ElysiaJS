import { db } from '../../config/db'
import { passwordUtils } from '../../utils/password'
import { Role } from '@prisma/client'

export const authService = {
    async register(body: any) {
        const { email, password, name } = body
        const hashedPassword = await passwordUtils.hash(password)

        return await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: Role.USER
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
    },

    async login(body: any) {
        const { email, password } = body
        const user = await db.user.findUnique({
            where: { email }
        })

        if (!user || !(await passwordUtils.compare(password, user.password))) {
            throw new Error('Invalid email or password')
        }

        return user
    },

    async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
        return await db.refreshToken.create({
            data: {
                userId,
                token,
                expiresAt
            }
        })
    },

    async rotateRefreshToken(oldToken: string, newToken: string, expiresAt: Date) {
        const storedToken = await db.refreshToken.findUnique({
            where: { token: oldToken }
        })

        if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
            throw new Error('Invalid or expired refresh token')
        }

        await db.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true }
        })

        return await this.saveRefreshToken(storedToken.userId, newToken, expiresAt)
    }
}
