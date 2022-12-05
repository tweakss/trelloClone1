FROM node:19-alpine3.15
ENV POSTGRES_PASSWORD=password


WORKDIR /home/app
COPY . /home/app


CMD cd /home/app; \
    npm install; \
    npm run seed; \
    npm run start-server;

#comment