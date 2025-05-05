FROM node:22-slim

RUN apt-get -qy update && apt-get -qy install openssl

WORKDIR /app

ENTRYPOINT [ "sh", "-c", "npm run start:local" ]