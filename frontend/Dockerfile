FROM node:alpine AS build

WORKDIR /app

COPY . .

RUN rm -rf package-lock.json node_modules

RUN npm install -g @angular/cli

RUN npm install

RUN npm run build:ssr

FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY --from=build /app/dist/frontend/server /app/server

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]