FROM node:alpine AS build

WORKDIR /app

COPY package.json ./

COPY . .

RUN rm -rf node_modules package-lock.json

RUN npm install

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/frontend /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
