FROM node:latest

LABEL Author="Rodrigo"

EXPOSE 5173

COPY . /var/www

WORKDIR /var/www

RUN npm install

RUN npm run build

ENV VITE_API_URL=http://localhost:5005/api
ENV VITE_APP_NAME=Greenlet
ENV SERVER_PORT=5005

ENTRYPOINT ["npm", "run", "dev"]