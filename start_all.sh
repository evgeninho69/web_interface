#!/bin/bash

# Скрипт для запуска всех сервисов Master Plan Studio

echo "🚀 Запуск Master Plan Studio..."
echo "================================"

# Загружаем переменные окружения
source ./load_env.sh

# Функция для проверки порта
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Порт $port уже занят"
        return 1
    else
        echo "✅ Порт $port свободен"
        return 0
    fi
}

# Функция для завершения процессов
cleanup() {
    echo ""
    echo "🛑 Завершение работы..."
    pkill -f "python app.py" 2>/dev/null
    pkill -f "react-scripts" 2>/dev/null
    pkill -f "autogenstudio" 2>/dev/null
    echo "✅ Все процессы завершены"
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGINT SIGTERM

# Проверяем порты
echo ""
echo "🔍 Проверка портов..."
check_port $FRONTEND_PORT || exit 1
check_port $BACKEND_PORT || exit 1
check_port $AUTOGEN_PORT || exit 1

# Запускаем бэкенд
echo ""
echo "🔧 Запуск бэкенда на порту $BACKEND_PORT..."
cd backend
source ../venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Ждем запуска бэкенда
sleep 3

# Запускаем фронтенд
echo ""
echo "🎨 Запуск фронтенда на порту $FRONTEND_PORT..."
cd frontend
PORT=$FRONTEND_PORT npm start &
FRONTEND_PID=$!
cd ..

# Ждем запуска фронтенда
sleep 5

# Запускаем AutoGen Studio
echo ""
echo "🤖 Запуск AutoGen Studio на порту $AUTOGEN_PORT..."
cd agents/autogen_studio
source ../../venv/bin/activate
autogenstudio ui --port $AUTOGEN_PORT --appdir ./myapp &
AUTOGEN_PID=$!
cd ../..

echo ""
echo "🎉 Все сервисы запущены!"
echo "================================"
echo "🌐 Фронтенд: http://localhost:$FRONTEND_PORT"
echo "🔧 Бэкенд: http://localhost:$BACKEND_PORT"
echo "🤖 AutoGen Studio: http://localhost:$AUTOGEN_PORT"
echo ""
echo "💡 Нажмите Ctrl+C для остановки всех сервисов"

# Ждем завершения
wait
