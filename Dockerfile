FROM oven/bun:latest as base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb* /temp/dev/
RUN cd /temp/dev && bun install

RUN mkdir -p /temp/prod
COPY package.json bun.lockb* /temp/prod/
RUN cd /temp/prod && bun install --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src src
COPY --from=prerelease /app/prisma prisma
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/tsconfig.json .

USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "run", "src/server.ts" ]
