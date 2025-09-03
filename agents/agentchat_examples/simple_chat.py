#!/usr/bin/env python3
"""
Простой пример использования AutoGen AgentChat
"""

import autogen
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

# Устанавливаем OpenAI API ключ из переменной окружения
import os

def main():
    # Проверяем наличие API ключа
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("❌ Ошибка: OPENAI_API_KEY не установлен!")
        print("💡 Установите переменную окружения:")
        print("   export OPENAI_API_KEY='ваш_ключ_здесь'")
        return

    # Конфигурация для OpenAI
    config_list = [
        {
            "model": "gpt-4",
            "api_key": api_key,
        }
    ]

    # Создаем агента-ассистента
    assistant = AssistantAgent(
        name="assistant",
        system_message="Вы - полезный ассистент, который помогает пользователям с их задачами.",
        llm_config={"config_list": config_list}
    )

    # Создаем агента-пользователя
    user_proxy = UserProxyAgent(
        name="user_proxy",
        human_input_mode="ALWAYS",
        max_consecutive_auto_reply=10,
        is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
        code_execution_config={"work_dir": "workspace"},
        llm_config={"config_list": config_list}
    )

    # Начинаем диалог
    user_proxy.initiate_chat(
        assistant,
        message="Привет! Расскажи мне о возможностях AutoGen AgentChat."
    )

if __name__ == "__main__":
    main()
