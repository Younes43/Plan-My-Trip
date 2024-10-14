FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV OPENAI_MODEL="gpt-4o-mini"

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

