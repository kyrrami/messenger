# Messenger (Nuxt 3 + PostgreSQL)

Полноценный fullstack-мессенджер с авторизацией, личными чатами и обновлением сообщений в реальном времени.

## 🛠 Стек технологий
- **Frontend:** Nuxt 3, Vue 3 (Composition API), Pinia, CSS
- **Backend:** Nuxt Nitro (Node.js)
- **База данных:** PostgreSQL (чистый SQL, без ORM)
- **Безопасность:** JWT (JSON Web Tokens), bcrypt (хеширование паролей), Zod (валидация)

## 🚀 Функционал
- Регистрация и авторизация пользователей.
- Просмотр списка пользователей.
- Создание личных чатов (1-на-1).
- Отправка и получение сообщений.
- Автообновление сообщений каждые 2 секунды (Polling).
- Защищенные API-эндпоинты (доступ только по JWT-токену).

## 💻 Как запустить локально

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/kyrrami/messenger.git
   cd messenger
2. Установите зависимости:
    ```
    npm instal
3. Создайте базу данных в PostgreSQL:
    ```
    CREATE DATABASE messenger;
4. Примените схему из файла schema.sql:
    ```
    psql -U postgres -d messenger -f schema.sql
5. Создайте файл .env в корне проекта и добавьте переменные (пример есть в .env.example):
    ```
    DATABASE_URL=postgresql://postgres:ваш_пароль@localhost:5432/messenger
    JWT_SECRET=ваш_секретный_ключ
6. Запустите сервер разработки:
    ```
    npm run dev

Приложение будет доступно по адресу http://localhost:3000.