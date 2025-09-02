#!/bin/bash

# Скрипт для настройки базы данных Supabase
# Требует установленный Supabase CLI

echo "🚀 Настройка базы данных Master Plan Studio..."

# Проверяем наличие Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI не найден. Установите его:"
    echo "npm install -g supabase"
    exit 1
fi

# Проверяем наличие файла с переменными окружения
if [ ! -f "config.env" ]; then
    echo "❌ Файл config.env не найден"
    exit 1
fi

# Загружаем переменные окружения
source config.env

echo "📋 Выполняем миграции..."

# Выполняем миграции в порядке
echo "1️⃣ Создание базовых таблиц..."
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.dthhtagcbhnfxudvoplu.supabase.co:5432/postgres" --file database/migrations/001_initial_schema.sql

echo "2️⃣ Настройка политик безопасности..."
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.dthhtagcbhnfxudvoplu.supabase.co:5432/postgres" --file database/migrations/002_policies.sql

echo "3️⃣ Создание функций..."
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.dthhtagcbhnfxudvoplu.supabase.co:5432/postgres" --file database/migrations/003_functions.sql

echo "✅ Миграции выполнены успешно!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Обновите токен доступа в .cursor/mcp.json"
echo "2. Перезапустите Cursor для подключения MCP Supabase"
echo "3. Запустите бэкенд: cd backend && python app.py"
echo "4. Запустите фронтенд: cd frontend && npm start"


