FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --silent --loglevel=error

COPY ./services/frontend .

CMD ["npx", "serve", "-l", "5000", "."]

