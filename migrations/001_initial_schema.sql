-- Schema para el sistema de seguros multi-tenant
-- Versión: 1.0
-- Fecha: 2025-05-20

-- Insertar roles iniciales si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'admin') THEN
        INSERT INTO public.roles (nombre) VALUES ('admin');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'agencia') THEN
        INSERT INTO public.roles (nombre) VALUES ('agencia');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'promotor') THEN
        INSERT INTO public.roles (nombre) VALUES ('promotor');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'cliente') THEN
        INSERT INTO public.roles (nombre) VALUES ('cliente');
    END IF;
END $$;

-- Crear tabla de usuarios_admin si no existe
CREATE TABLE IF NOT EXISTS public.usuarios_admin (
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, admin_id)
);

-- Crear tabla de usuarios_agencia si no existe
CREATE TABLE IF NOT EXISTS public.usuarios_agencia (
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    agencia_id UUID REFERENCES public.agencias(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, agencia_id)
);

-- Crear tabla de usuario_roles si no existe
CREATE TABLE IF NOT EXISTS public.usuario_roles (
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    rol_id INTEGER REFERENCES public.roles(id),
    UNIQUE(usuario_id, rol_id)
);

-- Crear vista para contar administradores y agencias por cuenta
CREATE OR REPLACE VIEW public.administradores_agencias_por_cuenta AS
SELECT 
    ua.usuario_id,
    COUNT(DISTINCT CASE WHEN ur.rol_id = (SELECT id FROM roles WHERE nombre = 'admin') THEN u.id END) as total_admins,
    COUNT(DISTINCT a.id) as total_agencias,
    COUNT(DISTINCT CASE WHEN ur.rol_id = (SELECT id FROM roles WHERE nombre = 'admin') AND a.creado_por = u.id THEN a.id END) as agencias_admin
FROM usuarios_admin ua
LEFT JOIN usuarios u ON u.id = ua.admin_id
LEFT JOIN agencias a ON a.creado_por = ua.admin_id
LEFT JOIN usuario_roles ur ON ur.usuario_id = u.id
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
                WHERE admin_id = NEW.usuario_id
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
            WHERE admin_id = NEW.creado_por
        )
        AND apc.total_agencias >= 3
    ) THEN
        RAISE EXCEPTION 'Esta cuenta ya tiene 3 agencias en total';
    END IF;
    
    -- Verificar límite de 3 agencias por administrador
    IF EXISTS (
        SELECT 1 
        FROM agencias a
        WHERE a.creado_por = NEW.creado_por
        GROUP BY a.creado_por
        HAVING COUNT(*) >= 3
    ) THEN
        RAISE EXCEPTION 'Un administrador solo puede crear hasta 3 agencias';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para verificar límites de administradores y agencias
CREATE TRIGGER check_admin_agencia_limit_trigger
BEFORE INSERT ON agencias
FOR EACH ROW
EXECUTE FUNCTION check_admin_agencia_limit();

-- Crear trigger para verificar límite de administradores por cuenta
CREATE TRIGGER check_admin_limit_por_cuenta_trigger
BEFORE INSERT ON usuario_roles
FOR EACH ROW
EXECUTE FUNCTION check_admin_limit_por_cuenta();

-- Tabla de Agencias
CREATE TABLE IF NOT EXISTS public.agencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    creado_por UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear vista para contar agencias por usuario
CREATE OR REPLACE VIEW public.agencias_por_usuario AS
SELECT 
    u.id as usuario_id,
    COUNT(*) as total_agencias
FROM usuarios u
JOIN usuario_roles ur ON ur.usuario_id = u.id
JOIN roles r ON r.id = ur.rol_id
JOIN agencias a ON a.creado_por = u.id
WHERE r.nombre = 'agencia'
GROUP BY u.id;

-- Crear función para verificar límite de agencias por usuario
CREATE OR REPLACE FUNCTION check_agencia_user_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar límite de 3 agencias por usuario
    IF NEW.creado_por IN (
        SELECT u.id 
        FROM usuarios u
        JOIN usuario_roles ur ON ur.usuario_id = u.id
        JOIN roles r ON r.id = ur.rol_id
        WHERE r.nombre = 'agencia'
    ) THEN
        IF (SELECT total_agencias FROM agencias_por_usuario 
            WHERE usuario_id = NEW.creado_por) >= 3 THEN
            RAISE EXCEPTION 'Un usuario solo puede ser agencia hasta 3 veces';
        END IF;
    END IF;
    
    -- Verificar límite de 2 agencias por administrador
    IF NEW.creado_por IN (
        SELECT u.id 
        FROM usuarios u
        JOIN usuario_roles ur ON ur.usuario_id = u.id
        JOIN roles r ON r.id = ur.rol_id
        WHERE r.nombre = 'admin'
    ) THEN
        IF (SELECT total_agencias FROM agencias_por_usuario 
            WHERE usuario_id = NEW.creado_por) >= 2 THEN
            RAISE EXCEPTION 'Un administrador solo puede crear hasta 2 agencias';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para verificar límites de agencias
CREATE TRIGGER check_agencia_user_limit_trigger
BEFORE INSERT ON agencias
FOR EACH ROW
EXECUTE FUNCTION check_agencia_user_limit();

-- Tabla de Promotores
CREATE TABLE IF NOT EXISTS public.promotores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    agencia_id UUID REFERENCES public.agencias(id) ON DELETE CASCADE,
    creado_por UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE REFERENCES public.usuarios(id) ON DELETE CASCADE,
    promotor_id UUID REFERENCES public.promotores(id) ON DELETE CASCADE,
    creado_por UUID REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Polizas
CREATE TABLE IF NOT EXISTS public.polizas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    numero_poliza VARCHAR(50) NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS public.pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poliza_id UUID REFERENCES public.polizas(id) ON DELETE CASCADE,
    fecha_pago DATE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    referencia VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Registro de Auditoría
CREATE TABLE IF NOT EXISTS public.auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    accion VARCHAR(50) NOT NULL,
    detalle TEXT,
    fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Restablecimiento de Contraseña
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id)
);


