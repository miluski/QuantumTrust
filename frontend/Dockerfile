FROM node:alpine as build

RUN npm i -g @angular/cli

WORKDIR /

RUN mkdir quantum-trust-frontend

WORKDIR /quantum-trust-frontend

COPY . /quantum-trust-frontend/

RUN rm -rf /quantum-trust-frontend/node_modules /quantum-trust-frontend/package-lock.json

RUN npm i

RUN ng build 

FROM nginx:alpine

COPY --from=build /quantum-trust-frontend/dist/frontend /usr/share/nginx/html

COPY /quantum-trust-frontend/nginx.conf /usr/share/nginx.conf
COPY /quantum-trust-frontend/certificate.pem /usr/share/certificate.pem 
COPY /quantum-trust-frontend/private-key.pem /usr/share/private-key.pem 

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]