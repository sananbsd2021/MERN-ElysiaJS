import { Elysia } from 'elysia'
import { response } from '../utils/response'

export const errorHandler = new Elysia()
    .onError(({ code, error, set }) => {
        console.error(`[Error] ${code}:`, error)

        if (code === 'VALIDATION') {
            set.status = 400
            return response.error('Validation Error', error.validator)
        }

        if (code === 'NOT_FOUND') {
            set.status = 404
            return response.error('Route not found')
        }

        set.status = 500
        return response.error(error.message || 'Internal Server Error')
    })
