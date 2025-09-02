-- Функция для создания компании и назначения пользователя владельцем
CREATE OR REPLACE FUNCTION create_company_with_owner(
    company_name VARCHAR(255),
    company_description TEXT DEFAULT NULL,
    owner_email VARCHAR(255),
    owner_password_hash VARCHAR(255),
    owner_first_name VARCHAR(100),
    owner_last_name VARCHAR(100)
)
RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    new_company_id UUID;
    result JSON;
BEGIN
    -- Создаем пользователя
    INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES (owner_email, owner_password_hash, owner_first_name, owner_last_name)
    RETURNING id INTO new_user_id;
    
    -- Создаем компанию
    INSERT INTO companies (name, description)
    VALUES (company_name, company_description)
    RETURNING id INTO new_company_id;
    
    -- Назначаем пользователя владельцем компании
    INSERT INTO company_members (company_id, user_id, role)
    VALUES (new_company_id, new_user_id, 'owner');
    
    -- Возвращаем результат
    result := json_build_object(
        'user_id', new_user_id,
        'company_id', new_company_id,
        'success', true
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для добавления пользователя в компанию
CREATE OR REPLACE FUNCTION add_user_to_company(
    company_id UUID,
    user_email VARCHAR(255),
    user_password_hash VARCHAR(255),
    user_first_name VARCHAR(100),
    user_last_name VARCHAR(100),
    user_role VARCHAR(50) DEFAULT 'member'
)
RETURNS JSON AS $$
DECLARE
    new_user_id UUID;
    result JSON;
BEGIN
    -- Создаем пользователя
    INSERT INTO users (email, password_hash, first_name, last_name)
    VALUES (user_email, user_password_hash, user_first_name, user_last_name)
    RETURNING id INTO new_user_id;
    
    -- Добавляем пользователя в компанию
    INSERT INTO company_members (company_id, user_id, role)
    VALUES (company_id, new_user_id, user_role);
    
    -- Возвращаем результат
    result := json_build_object(
        'user_id', new_user_id,
        'success', true
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для получения компаний пользователя
CREATE OR REPLACE FUNCTION get_user_companies(user_id UUID)
RETURNS TABLE (
    company_id UUID,
    company_name VARCHAR(255),
    company_description TEXT,
    user_role VARCHAR(50),
    joined_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.description,
        cm.role,
        cm.joined_at
    FROM companies c
    JOIN company_members cm ON c.id = cm.company_id
    WHERE cm.user_id = get_user_companies.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


