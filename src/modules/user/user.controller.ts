import { Elysia, t } from 'elysia'
import { userService } from './user.service'
import { authMiddleware } from '../../middleware/auth'
import { response } from '../../utils/response'
import { Role } from '@prisma/client'

export const userController = new Elysia({ prefix: '/users' })
    .use(authMiddleware)
    .guard({ isAuth: true }, (app) => app
        .get('/', async ({ query }) => {
            const result = await userService.findAll(query)
            return response.success(result, 'Users retrieved successfully')
        }, {
            query: t.Object({
                page: t.Optional(t.Numeric()),
                limit: t.Optional(t.Numeric()),
                search: t.Optional(t.String()),
                sortBy: t.Optional(t.String()),
                order: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')]))
            })
        })
        .get('/:id', async ({ params: { id } }) => {
            const user = await userService.findById(id)
            return response.success(user, 'User retrieved successfully')
        })
        .patch('/:id', async ({ params: { id }, body, user }) => {
            // Only admin or the user themselves can update
            if ((user as any).role !== Role.ADMIN && (user as any).id !== id) {
                throw new Error('Unauthorized to update this user')
            }
            const updatedUser = await userService.update(id, body)
            return response.success(updatedUser, 'User updated successfully')
        }, {
            body: t.Object({
                name: t.Optional(t.String()),
                email: t.Optional(t.String({ format: 'email' })),
                role: t.Optional(t.Enum(Role))
            })
        })
        .delete('/:id', async ({ params: { id } }) => {
            await userService.delete(id)
            return response.success(null, 'User deleted successfully')
        }, {
            role: Role.ADMIN
        })
    )
