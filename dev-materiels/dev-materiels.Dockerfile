FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli && npm install

RUN mkdir -p logs

COPY . .

RUN npm run build

RUN cp -r src/database/migrations dist/database/

EXPOSE 3000

CMD ["node", "dist/main.js"]
