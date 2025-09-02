-- Миграция 002: Политики безопасности
-- Применить в Supabase SQL Editor

-- Политики безопасности для таблицы companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view companies they are members of" ON companies
    FOR SELECT USING (
        id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create companies" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Company owners can update their companies" ON companies
    FOR UPDATE USING (
        id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid() AND role = 'owner'
        )
    );

-- Политики для таблицы users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Политики для таблицы company_members
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company members of their companies" ON company_members
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Company owners can manage members" ON company_members
    FOR ALL USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid() AND role = 'owner'
        )
    );

-- Политики для таблицы projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects of their companies" ON projects
    FOR SELECT USING (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Company members can create projects" ON projects
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can update projects" ON projects
    FOR UPDATE USING (
        created_by = auth.uid() OR
        company_id IN (
            SELECT company_id FROM company_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- Политики для таблицы project_members
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project members of their projects" ON project_members
    FOR SELECT USING (
        project_id IN (
            SELECT p.id FROM projects p
            JOIN company_members cm ON p.company_id = cm.company_id
            WHERE cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can manage project members" ON project_members
    FOR ALL USING (
        project_id IN (
            SELECT id FROM projects 
            WHERE created_by = auth.uid()
        ) OR
        project_id IN (
            SELECT p.id FROM projects p
            JOIN company_members cm ON p.company_id = cm.company_id
            WHERE cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')
        )
    );


