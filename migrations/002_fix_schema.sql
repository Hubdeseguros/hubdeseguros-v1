-- Eliminar tabla usuario_roles ya que no es necesaria
DROP TABLE IF EXISTS public.usuario_roles CASCADE;

-- Crear vista correcta para contar administradores y agencias
CREATE OR REPLACE VIEW public.administradores_agencias_por_cuenta AS
SELECT 
    ua.usuario_id,
    COUNT(DISTINCT CASE WHEN ua.admin_id IS NOT NULL THEN u.id END) as total_admins,
    COUNT(DISTINCT a.id) as total_agencias
FROM usuarios_admin ua
LEFT JOIN usuarios u ON u.id = ua.admin_id
LEFT JOIN agencias a ON a.creado_por = u.id
GROUP BY ua.usuario_id;

-- Crear función para verificar límites
CREATE OR REPLACE FUNCTION check_admin_agencia_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar límite de 3 administradores por cuenta
    IF NEW.rol_id = (SELECT id FROM roles WHERE nombre = 'admin') THEN
        IF EXISTS (
            SELECT 1 
            FROM administradores_agencias_por_cuenta apc
            WHERE apc.usuario_id = (
                SELECT usuario_id 
                FROM usuarios_admin 
                WHERE admin_id = NEW.user_id
            )
            AND apc.total_admins >= 3
        ) THEN
            RAISE EXCEPTION 'Esta cuenta ya tiene 3 administradores';
        END IF;
    END IF;
    
    -- Verificar límite de 3 agencias por cuenta
    IF EXISTS (
        SELECT 1 
        FROM administradores_agencias_por_cuenta apc
        WHERE apc.usuario_id = (
            SELECT usuario_id 
            FROM usuarios_admin 
            WHERE admin_id = (
                SELECT admin_id 
                FROM usuarios_admin 
                WHERE usuario_id = NEW.user_id
                LIMIT 1
            )
        )
        AND apc.total_agencias >= 3
    ) THEN
        RAISE EXCEPTION 'Esta cuenta ya tiene 3 agencias en total';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para la tabla users_agency
CREATE TRIGGER check_admin_agencia_limit_trigger
    BEFORE INSERT ON public.users_agency
    FOR EACH ROW
    EXECUTE FUNCTION check_admin_agencia_limit();
