FROM node:alpine AS build

WORKDIR /app

COPY . .

RUN rm -rf package-lock.json node_modules

RUN npm install -g @angular/cli

RUN npm install

RUN ng build

FROM node:18-alpine

RUN apk add --no-cache nginx

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY --from=build /app/dist/frontend/server /app/server
COPY --from=build /app/dist/frontend/browser /dist/frontend/browser

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 443

CMD ["sh", "-c", "node /app/server/main.server.mjs && nginx -g 'daemon off;'"]