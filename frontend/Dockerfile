FROM node:alpine AS build

WORKDIR /app

COPY package.json ./

COPY . .

RUN rm -rf node_modules package-lock.json

RUN npm install

RUN npm run build --prod

FROM nginx:alpine

RUN apk add --no-cache fail2ban

COPY --from=build /app/dist/frontend /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY /etc/fail2ban/jail.local /etc/fail2ban/jail.local
COPY /etc/fail2ban/filter.d/nginx-http-auth.conf /etc/fail2ban/filter.d/nginx-http-auth.conf

EXPOSE 80
EXPOSE 443

CMD ["sh", "-c", "fail2ban-client start && nginx -g 'daemon off;'"]
