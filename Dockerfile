FROM node:latest

LABEL Author="Rodrigo"

EXPOSE 5173

COPY . /var/www

WORKDIR /var/www

RUN npm install

RUN npm run build

ENTRYPOINT ["npm", "run", "dev"]