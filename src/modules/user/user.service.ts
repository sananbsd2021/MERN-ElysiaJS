import { db } from '../../config/db'
import { Role } from '@prisma/client'

export const userService = {
    async findAll(query: { page?: number; limit?: number; search?: string; sortBy?: string; order?: 'asc' | 'desc' }) {
        const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = query
        const skip = (page - 1) * limit

        const where = search ? {
            OR: [
                { email: { contains: search, mode: 'insensitive' as const } },
                { name: { contains: search, mode: 'insensitive' as const } }
            ]
        } : {}

        const [users, total] = await Promise.all([
            db.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: order },
                select: { id: true, email: true, name: true, role: true, createdAt: true }
            }),
            db.user.count({ where })
        ])

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    },

    async findById(id: string) {
        const user = await db.user.findUnique({
            where: { id },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        })
        if (!user) throw new Error('User not found')
        return user
    },

    async update(id: string, data: any) {
        return await db.user.update({
            where: { id },
            data,
            select: { id: true, email: true, name: true, role: true }
        })
    },

    async delete(id: string) {
        await db.user.delete({ where: { id } })
        return true
    }
}
