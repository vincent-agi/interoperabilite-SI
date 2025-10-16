FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli && npm install

# Création du dossier pour les logs
RUN mkdir -p logs

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
