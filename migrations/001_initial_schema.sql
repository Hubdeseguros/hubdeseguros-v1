-- Schema para el sistema de seguros multi-tenant
-- Versión: 1.0
-- Fecha: 2025-05-20

-- Insertar roles iniciales si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'admin') THEN
        INSERT INTO public.roles (nombre) VALUES ('admin');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'promotor') THEN
        INSERT INTO public.roles (nombre) VALUES ('promotor');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE nombre = 'cliente') THEN
        INSERT INTO public.roles (nombre) VALUES ('cliente');
    END IF;
END $$;

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

-- Tabla de Promotores
CREATE TABLE IF NOT EXISTS public.promotores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE REFERENCES public.usuarios(id) ON DELETE CASCADE,
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


