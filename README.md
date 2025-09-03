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

## 🚀 Быстрый старт

### 1. Настройка переменных окружения
```bash
# Создайте .env файл на основе примера
cp config.example.env .env

# Отредактируйте .env и добавьте ваши секреты
nano .env
```

### 2. Настройка базы данных Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Перейдите в SQL Editor
3. Выполните миграции в следующем порядке:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_policies.sql`
   - `database/migrations/003_functions.sql`

### 3. Установка зависимостей

#### Backend (Python/Flask)
```bash
# Создание виртуального окружения
python3 -m venv venv

# Активация виртуального окружения
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Установка зависимостей
pip install -r requirements.txt
```

#### Frontend (React)
```bash
cd frontend
npm install
```

### 4. Запуск приложения

#### Способ 1: Запуск всех сервисов (рекомендуется)
```bash
./start_all.sh
```

#### Способ 2: Ручной запуск
```bash
# Загрузите переменные окружения
source ./load_env.sh

# Backend
cd backend
source ../venv/bin/activate
python app.py

# Frontend (в новом терминале)
cd frontend
npm start

# AutoGen Studio (в новом терминале)
cd agents/autogen_studio
./start_autogen.sh
```

### 5. Доступ к приложению
- **Фронтенд**: http://localhost:3001
- **Бэкенд**: http://localhost:5003
- **AutoGen Studio**: http://localhost:8080

## 🔧 Ручной запуск бэкенда

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


