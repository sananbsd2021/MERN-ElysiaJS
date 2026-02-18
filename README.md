# ElysiaJS Production-Ready Backend

A high-performance backend template using [Bun](https://bun.sh) and [ElysiaJS](https://elysiajs.com).

## Tech Stack

- **Runtime**: Bun
- **Framework**: ElysiaJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (Access + Refresh Rotation)
- **Validation**: TypeBox
- **Cache**: Redis
- **Logger**: Pino
- **Documentation**: Swagger

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- [Docker](https://www.docker.com) installed

### Local Development

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your desired configuration.

3. **Prisma setup**:
   ```bash
   bun run db:migrate
   ```

4. **Run the server**:
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3000/api/v1`.
Swagger documentation: `http://localhost:3000/docs`.

### Using Docker

Run everything with a single command:
```bash
docker compose up --build
```

## API Features

- Standardized Response Format
- Global Error Handling
- JWT Rotation (15m access, 7d refresh)
- Role-based Authorization (`ADMIN`, `USER`)
- User CRUD with Pagination & Filtering
- Pino Logging with Pretty Output
- Graceful Shutdown
- Health Check

## License

MIT
