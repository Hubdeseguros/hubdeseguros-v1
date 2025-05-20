-- Eliminar tabla users_agency incorrecta
DROP TABLE IF EXISTS public.users_agency CASCADE;

-- Crear tabla correcta de roles por usuario
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- Crear tabla correcta de usuarios por agencia
CREATE TABLE IF NOT EXISTS public.users_agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, agency_id)
);

-- Crear función para verificar límites
CREATE OR REPLACE FUNCTION check_admin_agency_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_admin_count INTEGER;
    current_agency_count INTEGER;
BEGIN
    -- Verificar límite de 3 administradores por cuenta
    SELECT COUNT(*) INTO current_admin_count
    FROM user_roles ur
    JOIN users_admin ua ON ur.user_id = ua.user_id
    WHERE ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    AND ua.admin_id = NEW.admin_id;

    IF current_admin_count >= 3 THEN
        RAISE EXCEPTION 'Esta cuenta ya tiene 3 administradores';
    END IF;

    -- Verificar límite de 3 agencias por usuario
    SELECT COUNT(*) INTO current_agency_count
    FROM users_agencies
    WHERE user_id = NEW.user_id;

    IF current_agency_count >= 3 THEN
        RAISE EXCEPTION 'Este usuario ya tiene 3 agencias';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para la tabla users_admin
CREATE TRIGGER check_admin_limit_trigger
    BEFORE INSERT ON public.users_admin
    FOR EACH ROW
    EXECUTE FUNCTION check_admin_agency_limit();

-- Crear trigger para la tabla users_agencies
CREATE TRIGGER check_agency_limit_trigger
    BEFORE INSERT ON public.users_agencies
    FOR EACH ROW
    EXECUTE FUNCTION check_admin_agency_limit();
