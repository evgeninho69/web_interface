from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from services.auth_service import AuthService
from services.company_service import CompanyService
from services.project_service import ProjectService
from utils.database import get_supabase_client

# Загружаем переменные окружения
load_dotenv('../config.env')

app = Flask(__name__)
CORS(app)

# Инициализируем сервисы
auth_service = AuthService()
company_service = CompanyService()
project_service = ProjectService()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка состояния API"""
    return jsonify({'status': 'ok', 'message': 'API работает'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Регистрация нового пользователя и создание компании"""
    try:
        data = request.get_json()
        
        # Валидация данных
        required_fields = ['email', 'password', 'firstName', 'lastName', 'companyName']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Поле {field} обязательно'}), 400
        
        # Регистрация пользователя и создание компании
        result = auth_service.register_user_and_company(
            email=data['email'],
            password=data['password'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            company_name=data['companyName'],
            company_description=data.get('companyDescription', '')
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Пользователь и компания успешно созданы',
                'data': result['data']
            }), 201
        else:
            return jsonify({'error': result['error']}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Вход пользователя в систему"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email и пароль обязательны'}), 400
        
        result = auth_service.login_user(
            email=data['email'],
            password=data['password']
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Успешный вход',
                'data': result['data']
            }), 200
        else:
            return jsonify({'error': result['error']}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/companies', methods=['GET'])
def get_user_companies():
    """Получение компаний пользователя"""
    try:
        user_id = request.headers.get('X-User-ID')
        if not user_id:
            return jsonify({'error': 'Необходима авторизация'}), 401
        
        companies = company_service.get_user_companies(user_id)
        return jsonify({
            'success': True,
            'data': companies
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['GET'])
def get_company_projects():
    """Получение проектов компании"""
    try:
        company_id = request.args.get('company_id')
        if not company_id:
            return jsonify({'error': 'ID компании обязателен'}), 400
        
        projects = project_service.get_company_projects(company_id)
        return jsonify({
            'success': True,
            'data': projects
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['POST'])
def create_project():
    """Создание нового проекта"""
    try:
        data = request.get_json()
        user_id = request.headers.get('X-User-ID')
        
        if not user_id:
            return jsonify({'error': 'Необходима авторизация'}), 401
        
        required_fields = ['name', 'company_id']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Поле {field} обязательно'}), 400
        
        result = project_service.create_project(
            name=data['name'],
            description=data.get('description', ''),
            company_id=data['company_id'],
            created_by=user_id
        )
        
        if result['success']:
            return jsonify({
                'success': True,
                'message': 'Проект успешно создан',
                'data': result['data']
            }), 201
        else:
            return jsonify({'error': result['error']}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5003)


