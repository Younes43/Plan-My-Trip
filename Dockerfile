# Dockerfile

FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

ENV NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=${NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
ENV OPENAI_MODEL="gpt-4o-mini"

RUN npm run build


# Production image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY next.config.mjs ./

ENV OPENAI_MODEL="gpt-4o-mini"

EXPOSE 3000

CMD ["npm", "start"]
