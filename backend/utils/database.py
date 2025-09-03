from supabase import create_client, Client
import os

def get_supabase_client() -> Client:
    """Создание клиента Supabase"""
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_SECRET')
    
    if not url or not key:
        raise ValueError("Не найдены переменные окружения SUPABASE_URL или SUPABASE_SERVICE_ROLE_SECRET")
    
    return create_client(url, key)

def get_supabase_anon_client() -> Client:
    """Создание анонимного клиента Supabase"""
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_ANON_KEY')
    
    if not url or not key:
        raise ValueError("Не найдены переменные окружения SUPABASE_URL или SUPABASE_ANON_KEY")
    
    return create_client(url, key)


