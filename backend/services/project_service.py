from utils.database import get_supabase_client

class ProjectService:
    def __init__(self):
        self.supabase = get_supabase_client()
    
    def get_company_projects(self, company_id: str) -> list:
        """Получение проектов компании"""
        try:
            result = self.supabase.table('projects').select(
                'id, name, description, created_at, created_by, users(first_name, last_name)'
            ).eq('company_id', company_id).order('created_at', desc=True).execute()
            
            return result.data or []
            
        except Exception as e:
            print(f"Ошибка при получении проектов: {e}")
            return []
    
    def create_project(self, name: str, description: str, company_id: str, created_by: str) -> dict:
        """Создание нового проекта"""
        try:
            result = self.supabase.table('projects').insert({
                'name': name,
                'description': description,
                'company_id': company_id,
                'created_by': created_by
            }).execute()
            
            if result.data:
                # Добавляем создателя как владельца проекта
                self.supabase.table('project_members').insert({
                    'project_id': result.data[0]['id'],
                    'user_id': created_by,
                    'role': 'owner'
                }).execute()
                
                return {
                    'success': True,
                    'data': result.data[0]
                }
            else:
                return {'success': False, 'error': 'Ошибка при создании проекта'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_project_members(self, project_id: str) -> list:
        """Получение участников проекта"""
        try:
            result = self.supabase.table('project_members').select(
                'id, role, joined_at, users(id, email, first_name, last_name)'
            ).eq('project_id', project_id).execute()
            
            return result.data or []
            
        except Exception as e:
            print(f"Ошибка при получении участников проекта: {e}")
            return []


