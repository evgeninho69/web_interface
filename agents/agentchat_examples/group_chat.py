#!/usr/bin/env python3
"""
Пример группового чата с несколькими агентами
"""

from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
from autogen_agentchat.teams import GroupChat, GroupChatManager

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

    # Создаем агентов с разными ролями
    coder = AssistantAgent(
        name="coder",
        system_message="Ты опытный программист. Помогай с написанием кода и решением технических проблем.",
        llm_config={"config_list": config_list, "temperature": 0.7}
    )
    
    analyst = AssistantAgent(
        name="analyst",
        system_message="Ты аналитик данных. Помогай с анализом, планированием и стратегией.",
        llm_config={"config_list": config_list, "temperature": 0.7}
    )
    
    writer = AssistantAgent(
        name="writer",
        system_message="Ты писатель и редактор. Помогай с созданием текстов, документации и презентаций.",
        llm_config={"config_list": config_list, "temperature": 0.7}
    )

    # Создаем пользователя-прокси
    user_proxy = UserProxyAgent(
        name="user_proxy",
        human_input_mode="ALWAYS",
        max_consecutive_auto_reply=10,
        is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
        code_execution_config={"work_dir": "workspace"},
        llm_config={"config_list": config_list}
    )

    # Создаем групповой чат
    groupchat = GroupChat(
        agents=[user_proxy, coder, analyst, writer],
        messages=[],
        max_round=50
    )

    # Создаем менеджер группового чата
    manager = GroupChatManager(
        groupchat=groupchat,
        llm_config={"config_list": config_list}
    )

    # Начинаем групповой чат
    print("🤖 AutoGen GroupChat запущен!")
    print("👥 Участники: Программист, Аналитик, Писатель")
    print("💬 Начните обсуждение (введите 'quit' для выхода)")
    print("-" * 50)
    
    user_proxy.initiate_chat(
        manager,
        message="Привет всем! Давайте обсудим, как создать веб-приложение для управления проектами. Каждый из вас может предложить свой взгляд на задачу."
    )

if __name__ == "__main__":
    main()
