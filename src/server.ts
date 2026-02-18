import { app } from './app'
import { db } from './config/db'
import { redis } from './config/redis'

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${port}`)
    console.log(`📜 Swagger documentation available at http://localhost:${port}/docs`)
})

// Graceful shutdown
const shutdown = async () => {
    console.log('\nShutting down...')
    await db.$disconnect()
    await redis.disconnect()
    server.stop()
    process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
