FROM node:alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --silent --loglevel=error

COPY ./proto ./proto
COPY ./services/cart .

CMD ["node", "index.js"]

