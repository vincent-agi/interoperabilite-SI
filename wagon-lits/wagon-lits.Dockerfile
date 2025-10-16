FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli && npm install

# Création du dossier pour les logs
RUN mkdir -p logs

COPY . .

# Compilation du projet pour la production
RUN npm run build

# S'assurer que les migrations sont copiées dans le répertoire dist
RUN cp -r src/database/migrations dist/database/

EXPOSE 3000

# Remplacé par la commande dans docker-compose.yml
CMD ["node", "dist/main.js"]
