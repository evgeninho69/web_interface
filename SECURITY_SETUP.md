# 🔒 Безопасная настройка API ключей

## ⚠️ ВАЖНО: Безопасность

**НИКОГДА не коммитьте API ключи в Git!** Это может привести к:
- Краже ваших ключей
- Списанию денег с вашего аккаунта
- Нарушению безопасности данных

## 🔑 Настройка OpenAI API ключа

### Способ 1: Переменные окружения (рекомендуется)

```bash
# Установите переменную окружения
export OPENAI_API_KEY="sk-proj-ваш_ключ_здесь"

# Проверьте установку
echo $OPENAI_API_KEY
```

### Способ 2: .env файл

```bash
# Создайте .env файл в корне проекта
cp config.env .env

# Отредактируйте .env и добавьте ваш ключ
nano .env
```

**Содержимое .env:**
```env
# Supabase Configuration
SUPABASE_URL=ваш_url
SUPABASE_ANON_KEY=ваш_ключ
SUPABASE_SERVICE_ROLE_SECRET=ваш_секрет

# Flask Configuration
FLASK_SECRET_KEY=ваш_секрет
FLASK_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-ваш_ключ_здесь
```

## 🚀 Запуск с API ключами

### AutoGen Studio
```bash
cd agents/autogen_studio
export OPENAI_API_KEY="ваш_ключ"
./start_autogen.sh
```

### AgentChat
```bash
cd agents
source agentchat_venv/bin/activate
export OPENAI_API_KEY="ваш_ключ"
python agentchat_examples/simple_chat.py
```

## 🛡️ Дополнительная защита

### 1. Ротация ключей
- Регулярно меняйте API ключи
- Используйте разные ключи для разных проектов

### 2. Мониторинг использования
- Следите за расходами в OpenAI
- Настройте уведомления о превышении лимитов

### 3. Ограничение доступа
- Используйте ключи только с необходимыми правами
- Не давайте доступ третьим лицам

## 🔍 Проверка безопасности

### Проверить, что секреты не в Git:
```bash
# Поиск API ключей в истории Git
git log --all --full-history -- "**/config.env"
git log --all --full-history -- "**/env_vars.txt"

# Поиск в текущих файлах
grep -r "sk-proj-" .
```

### Проверить .gitignore:
```bash
# Убедитесь, что секретные файлы игнорируются
cat .gitignore | grep -E "(\.env|config\.env|env_vars\.txt)"
```

## 🆘 Если ключ попал в Git

### 1. Немедленно отозвать ключ
- Зайдите в OpenAI Dashboard
- Создайте новый ключ
- Отзовите старый ключ

### 2. Очистить историю Git
```bash
# Удалить файл из истории Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch config.env" \
  --prune-empty --tag-name-filter cat -- --all

# Принудительно обновить удаленный репозиторий
git push origin --force --all
```

### 3. Обновить .gitignore
- Добавьте все секретные файлы в .gitignore
- Проверьте, что новые файлы не попадают в Git

## 📚 Полезные ссылки

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GitHub Security Best Practices](https://docs.github.com/en/github/security)
- [Environment Variables Best Practices](https://12factor.net/config)
