# Master Plan Studio

Корпоративная платформа для управления проектами и накопления знаний.

## Структура проекта

```
web_interface/
├── backend/                 # Flask API сервер
│   ├── services/           # Бизнес-логика
│   ├── models/            # Модели данных
│   ├── views/             # API endpoints
│   ├── utils/             # Вспомогательные функции
│   └── app.py             # Основное приложение
├── frontend/              # React приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── contexts/      # React контексты
│   │   └── App.js         # Главный компонент
│   └── package.json
├── database/              # База данных Supabase
│   ├── migrations/        # SQL миграции
│   └── schemas/           # Схемы БД
├── config.env             # Переменные окружения
└── requirements.txt       # Python зависимости
```

## Настройка и запуск

### 1. Настройка базы данных Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Перейдите в SQL Editor
3. Выполните миграции в следующем порядке:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_policies.sql`
   - `database/migrations/003_functions.sql`

### 2. Настройка переменных окружения

Файл `config.env` уже содержит ваши ключи Supabase. При необходимости обновите их.

### 3. Запуск бэкенда

```bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск Flask сервера
cd backend
python app.py
```

Сервер будет доступен по адресу: http://localhost:5003

### 4. Запуск фронтенда

```bash
# Установка зависимостей
cd frontend
npm install

# Запуск React приложения
npm start
```

Приложение будет доступно по адресу: http://localhost:3001

## Функциональность

### ✅ Реализовано

1. **Титульный лист** - красивая landing page с описанием возможностей
2. **Аутентификация** - регистрация и вход в систему
3. **Управление компаниями** - создание компании при регистрации
4. **Дашборд** - просмотр компаний и проектов
5. **База данных** - полная схема с политиками безопасности

### 🔄 В разработке

- Управление участниками компаний
- Детальная работа с проектами
- AI агенты
- RAG база знаний

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя и создание компании
- `POST /api/auth/login` - Вход в систему

### Компании
- `GET /api/companies` - Получение компаний пользователя

### Проекты
- `GET /api/projects?company_id={id}` - Получение проектов компании
- `POST /api/projects` - Создание нового проекта

## Технологии

- **Backend**: Flask, Supabase, bcrypt, JWT
- **Frontend**: React, React Router, Styled Components, Axios
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT токены

## Безопасность

- Пароли хешируются с помощью bcrypt
- JWT токены для аутентификации
- Row Level Security (RLS) в Supabase
- CORS настроен для фронтенда

## Разработка

Для разработки рекомендуется:

1. Запустить бэкенд в режиме отладки: `FLASK_DEBUG=True python app.py`
2. Фронтенд автоматически перезагружается при изменениях
3. Используйте браузерные инструменты разработчика для отладки

## Поддержка

При возникновении проблем проверьте:

1. Правильность ключей Supabase в `config.env`
2. Выполнены ли все миграции базы данных
3. Запущены ли оба сервера (бэкенд и фронтенд)
4. Логи в консоли браузера и терминале


