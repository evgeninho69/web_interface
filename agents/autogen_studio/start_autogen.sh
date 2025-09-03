#!/bin/bash

# Скрипт для запуска AutoGen Studio с OpenAI API ключом

# Проверяем наличие API ключа
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Ошибка: OPENAI_API_KEY не установлен!"
    echo "💡 Установите переменную окружения:"
    echo "   export OPENAI_API_KEY='ваш_ключ_здесь'"
    echo ""
    echo "🔑 Или создайте .env файл в папке autogen_studio/"
    echo "   cp env_vars.txt .env"
    echo "   # Затем отредактируйте .env и добавьте ваш ключ"
    exit 1
fi

# Активируем виртуальное окружение
source ../../venv/bin/activate

# Запускаем AutoGen Studio
port=${AUTOGEN_PORT:-8080}
echo "🚀 Запуск AutoGen Studio с OpenAI API ключом..."
echo "🌐 Доступен по адресу: http://localhost:$port"
echo "🔑 OpenAI API ключ установлен"

autogenstudio ui --port $port --appdir ./myapp
