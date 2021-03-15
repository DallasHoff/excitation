FROM node:14-alpine

WORKDIR /usr/src/app
COPY .env.production .env
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3000
CMD [ "node", "." ]
USER node