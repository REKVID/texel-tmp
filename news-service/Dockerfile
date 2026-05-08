FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8002

# Запускаем приложение
CMD ["npm", "start"]

