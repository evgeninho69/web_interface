#!/bin/bash

# Скрипт для запуска примеров AutoGen AgentChat

# Активируем виртуальное окружение AgentChat
source agentchat_venv/bin/activate

echo "🤖 AutoGen AgentChat Examples"
echo "=============================="
echo "1. Простой чат с одним агентом"
echo "2. Групповой чат с несколькими агентами"
echo "3. Выход"
echo ""

read -p "Выберите пример (1-3): " choice

case $choice in
    1)
        echo "🚀 Запуск простого чата..."
        python agentchat_examples/simple_chat.py
        ;;
    2)
        echo "🚀 Запуск группового чата..."
        python agentchat_examples/group_chat.py
        ;;
    3)
        echo "👋 До свидания!"
        exit 0
        ;;
    *)
        echo "❌ Неверный выбор. Попробуйте снова."
        exit 1
        ;;
esac
