FROM node:alpine

RUN npm i -g @angular/cli

WORKDIR /

RUN mkdir quantum-trust-frontend

WORKDIR /quantum-trust-frontend

COPY . /quantum-trust-frontend/

RUN npm i

CMD ["ng", "serve", "--host", "0.0.0.0"]