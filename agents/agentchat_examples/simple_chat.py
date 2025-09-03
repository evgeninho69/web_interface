#!/usr/bin/env python3
"""
Простой пример использования AutoGen AgentChat (новая версия)
"""

import asyncio
from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient
import os

async def main():
    # Проверяем наличие API ключа
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("❌ Ошибка: OPENAI_API_KEY не установлен!")
        print("💡 Установите переменную окружения:")
        print("   export OPENAI_API_KEY='ваш_ключ_здесь'")
        return

    print("🔑 API ключ найден, создаем клиента...")

    # Создаем клиент OpenAI
    model_client = OpenAIChatCompletionClient(
        model="gpt-4",
        api_key=api_key
    )

    # Создаем агента-ассистента
    assistant = AssistantAgent(
        name="assistant",
        model_client=model_client,
        system_message="Вы - полезный ассистент, который помогает пользователям с их задачами."
    )

    print("🤖 Ассистент создан, начинаем диалог...")
    print("💬 Задаем вопрос ассистенту...")
    print("-" * 50)

    # Запускаем ассистента с задачей
    result = await assistant.run(
        task="Привет! Расскажи мне о возможностях AutoGen AgentChat."
    )
    
    print("📝 Ответ ассистента:")
    print(result.messages[-1].content if result.messages else "Нет ответа")

if __name__ == "__main__":
    asyncio.run(main())
