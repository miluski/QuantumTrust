FROM node:22.9-alpine

RUN npm i -g @angular/cli

WORKDIR /

RUN mkdir quantum-trust-frontend

WORKDIR /quantum-trust-frontend

COPY . /quantum-trust-frontend/

RUN rm -rf /quantum-trust-frontend/node_modules /quantum-trust-frontend/package-lock.json

RUN npm i

CMD ["ng", "serve", "--host", "0.0.0.0"]