# استخدم Node image مناسب
FROM node:18

# مكان المشروع داخل الكونتينر
WORKDIR /app

# انسخ الباك اند فقط
COPY ./package*.json ./
COPY ./prisma ./prisma

# نسطب الباكج
RUN npm install

# ننسخ بقية الملفات
COPY . .

# نجهز Prisma
RUN npx prisma generate

# نجهز البورت
EXPOSE 5000

# أمر التشغيل
CMD ["npm", "run", "start"]
