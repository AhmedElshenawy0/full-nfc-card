FROM node:18

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

# نعمل build
RUN npm run build

# نستخدم nginx لتشغيل الموقع (بدل dev server)
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
