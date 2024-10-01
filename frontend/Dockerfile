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

COPY nginx.conf /usr/share/nginx/nginx.conf
COPY certificate.pem /usr/share/nginx/certificate.pem 
COPY private-key.pem /usr/share/nginx/private-key.pem 

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]