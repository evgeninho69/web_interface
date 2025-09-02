import bcrypt
import jwt
from datetime import datetime, timedelta
from utils.database import get_supabase_client
import os

class AuthService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.jwt_secret = os.getenv('SECRET_KEY', 'your-secret-key-here')
    
    def hash_password(self, password: str) -> str:
        """Хеширование пароля"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Проверка пароля"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    
    def generate_token(self, user_id: str) -> str:
        """Генерация JWT токена"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, self.jwt_secret, algorithm='HS256')
    
    def verify_token(self, token: str) -> dict:
        """Проверка JWT токена"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
            return {'success': True, 'user_id': payload['user_id']}
        except jwt.ExpiredSignatureError:
            return {'success': False, 'error': 'Токен истек'}
        except jwt.InvalidTokenError:
            return {'success': False, 'error': 'Недействительный токен'}
    
    def register_user_and_company(self, email: str, password: str, first_name: str, 
                                 last_name: str, company_name: str, company_description: str = '') -> dict:
        """Регистрация пользователя и создание компании"""
        try:
            # Проверяем, существует ли пользователь
            existing_user = self.supabase.table('users').select('id').eq('email', email).execute()
            if existing_user.data:
                return {'success': False, 'error': 'Пользователь с таким email уже существует'}
            
            # Хешируем пароль
            password_hash = self.hash_password(password)
            
            # Вызываем функцию создания компании с владельцем
            result = self.supabase.rpc('create_company_with_owner', {
                'company_name': company_name,
                'company_description': company_description,
                'owner_email': email,
                'owner_password_hash': password_hash,
                'owner_first_name': first_name,
                'owner_last_name': last_name
            }).execute()
            
            if result.data and result.data.get('success'):
                # Генерируем токен
                token = self.generate_token(result.data['user_id'])
                
                return {
                    'success': True,
                    'data': {
                        'user_id': result.data['user_id'],
                        'company_id': result.data['company_id'],
                        'token': token
                    }
                }
            else:
                return {'success': False, 'error': 'Ошибка при создании пользователя и компании'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def login_user(self, email: str, password: str) -> dict:
        """Вход пользователя"""
        try:
            # Находим пользователя
            user_result = self.supabase.table('users').select('*').eq('email', email).execute()
            
            if not user_result.data:
                return {'success': False, 'error': 'Пользователь не найден'}
            
            user = user_result.data[0]
            
            # Проверяем пароль
            if not self.verify_password(password, user['password_hash']):
                return {'success': False, 'error': 'Неверный пароль'}
            
            # Получаем компании пользователя
            companies_result = self.supabase.rpc('get_user_companies', {
                'user_id': user['id']
            }).execute()
            
            # Генерируем токен
            token = self.generate_token(user['id'])
            
            return {
                'success': True,
                'data': {
                    'user_id': user['id'],
                    'email': user['email'],
                    'first_name': user['first_name'],
                    'last_name': user['last_name'],
                    'companies': companies_result.data or [],
                    'token': token
                }
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}


