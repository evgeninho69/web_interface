from utils.database import get_supabase_client

class CompanyService:
    def __init__(self):
        self.supabase = get_supabase_client()
    
    def get_user_companies(self, user_id: str) -> list:
        """Получение компаний пользователя"""
        try:
            result = self.supabase.rpc('get_user_companies', {
                'user_id': user_id
            }).execute()
            
            return result.data or []
            
        except Exception as e:
            print(f"Ошибка при получении компаний: {e}")
            return []
    
    def get_company_members(self, company_id: str) -> list:
        """Получение участников компании"""
        try:
            result = self.supabase.table('company_members').select(
                'id, role, joined_at, users(id, email, first_name, last_name)'
            ).eq('company_id', company_id).execute()
            
            return result.data or []
            
        except Exception as e:
            print(f"Ошибка при получении участников компании: {e}")
            return []
    
    def add_member_to_company(self, company_id: str, email: str, password: str, 
                             first_name: str, last_name: str, role: str = 'member') -> dict:
        """Добавление участника в компанию"""
        try:
            result = self.supabase.rpc('add_user_to_company', {
                'company_id': company_id,
                'user_email': email,
                'user_password_hash': password,
                'user_first_name': first_name,
                'user_last_name': last_name,
                'user_role': role
            }).execute()
            
            if result.data and result.data.get('success'):
                return {
                    'success': True,
                    'data': result.data
                }
            else:
                return {'success': False, 'error': 'Ошибка при добавлении участника'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}


