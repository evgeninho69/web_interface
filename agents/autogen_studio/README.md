# AutoGen Studio - Настройка и запуск

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
# Активируем виртуальное окружение
source ../../venv/bin/activate

# Устанавливаем AutoGen Studio
pip install -U autogenstudio
```

### 2. Настройка OpenAI API ключа

#### Способ 1: Переменная окружения (рекомендуется)
```bash
export OPENAI_API_KEY='ваш_ключ_здесь'
```

#### Способ 2: Файл .env
```bash
# Создайте .env файл в папке autogen_studio/
echo "OPENAI_API_KEY=ваш_ключ_здесь" > .env
```

### 3. Запуск AutoGen Studio

#### Способ 1: Автоматический запуск
```bash
./start_autogen.sh
```

#### Способ 2: Ручной запуск
```bash
# Убедитесь, что API ключ установлен
echo $OPENAI_API_KEY

# Запускаем AutoGen Studio
autogenstudio ui --port 8080 --appdir ./myapp
```

### 4. Доступ к интерфейсу
- **URL**: http://localhost:8080
- **Порт**: 8080 (настраивается)

## 🔧 Конфигурация

### Переменные окружения
- `OPENAI_API_KEY` - ваш OpenAI API ключ
- `AUTOGEN_PORT` - порт для AutoGen Studio (по умолчанию: 8080)

### Структура папок
```
autogen_studio/
├── myapp/           # Приложение AutoGen Studio
├── README.md        # Этот файл
├── start_autogen.sh # Скрипт запуска
└── .env             # Переменные окружения (не коммитить!)
```

## 🚨 Важные замечания

1. **НИКОГДА не коммитьте API ключи в Git!**
2. Используйте переменные окружения или `.env` файлы
3. Файл `.env` добавлен в `.gitignore`
4. Регулярно ротируйте API ключи

## 🆘 Устранение неполадок

### Ошибка "API ключ не установлен"
```bash
export OPENAI_API_KEY='ваш_ключ_здесь'
```

### Ошибка "Порт занят"
```bash
# Измените порт
autogenstudio ui --port 8081 --appdir ./myapp
```

### Ошибка "Permission denied"
- Проверьте права доступа к папке
- Убедитесь, что виртуальное окружение активировано

## 📚 Дополнительные ресурсы

- [AutoGen Studio документация](https://microsoft.github.io/autogen/)
- [OpenAI API документация](https://platform.openai.com/docs)
- [Примеры использования](https://github.com/microsoft/autogen/tree/main/samples)
