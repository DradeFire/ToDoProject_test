FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

RUN npm install -g ts-node

COPY . .

EXPOSE 3000

CMD ["npm", "run", "prod"]