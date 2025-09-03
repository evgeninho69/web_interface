#!/bin/bash

# Скрипт для загрузки переменных окружения из .env файла

if [ -f ".env" ]; then
    echo "🔧 Загружаем переменные окружения из .env..."
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Переменные окружения загружены"
    echo ""
    echo "📋 Доступные переменные:"
    echo "  - FRONTEND_PORT: ${FRONTEND_PORT:-3001}"
    echo "  - BACKEND_PORT: ${BACKEND_PORT:-5003}"
    echo "  - AUTOGEN_PORT: ${AUTOGEN_PORT:-8080}"
    echo "  - SUPABASE_URL: ${SUPABASE_URL:-не установлен}"
    echo "  - OPENAI_API_KEY: ${OPENAI_API_KEY:+установлен}"
    echo ""
else
    echo "❌ Файл .env не найден!"
    echo "💡 Создайте файл .env на основе config.example.env"
    exit 1
fi
