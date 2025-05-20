-- Schema para el sistema de seguros multi-tenant
-- Versión: 1.0
-- Fecha: 2025-05-20

-- Configuración inicial
SET client_encoding = 'UTF8';
SET default_transaction_isolation = 'read committed';
SET timezone = 'UTC';

-- Crear esquema
CREATE SCHEMA IF NOT EXISTS insurance;
SET search_path TO insurance,public;

-- Tabla de Agencias
CREATE TABLE IF NOT EXISTS agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT true,
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id)
);

-- Tabla de Usuarios por Agencia (con restricción de 3 admins)
CREATE TABLE IF NOT EXISTS users_agency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, agency_id)
);

-- Tabla de Promotores
CREATE TABLE IF NOT EXISTS promoters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    promoter_id UUID REFERENCES promoters(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Polizas
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Registro de Auditoría
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    action_details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Restablecimiento de Contraseña
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at
    BEFORE UPDATE ON policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Restricción para máximo 3 admins por agencia
CREATE OR REPLACE FUNCTION check_max_admins_per_agency()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM users_agency 
         WHERE agency_id = NEW.agency_id 
         AND role_id = (SELECT id FROM roles WHERE name = 'ADMIN')) > 2 THEN
        RAISE EXCEPTION 'Maximum of 3 admins per agency reached';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_max_admins
    BEFORE INSERT ON users_agency
    FOR EACH ROW
    EXECUTE FUNCTION check_max_admins_per_agency();

-- Restricción para solo admins creando admins
CREATE OR REPLACE FUNCTION check_admin_creation()
RETURNS TRIGGER AS $$
DECLARE
    creator_role VARCHAR(50);
BEGIN
    SELECT r.name INTO creator_role
    FROM users u
    JOIN users_agency ua ON u.id = ua.user_id
    JOIN roles r ON ua.role_id = r.id
    WHERE u.id = NEW.created_by;

    IF creator_role != 'ADMIN' THEN
        RAISE EXCEPTION 'Only admins can create other admins';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_admin_creation_trigger
    BEFORE INSERT ON users_agency
    FOR EACH ROW
    WHEN (NEW.role_id = (SELECT id FROM roles WHERE name = 'ADMIN'))
    EXECUTE FUNCTION check_admin_creation();

-- Insertar roles iniciales
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Administrador de agencia'),
('PROMOTOR', 'Promotor de seguros'),
('CLIENTE', 'Cliente de seguros');

-- Función para resetear intentos fallidos después de login exitoso
CREATE OR REPLACE FUNCTION reset_failed_attempts()
RETURNS TRIGGER AS $$
BEGIN
    NEW.failed_login_attempts = 0;
    NEW.last_failed_login = NULL;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER reset_failed_attempts_trigger
    AFTER UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.failed_login_attempts > 0 AND NEW.failed_login_attempts = 0)
    EXECUTE FUNCTION reset_failed_attempts();

-- Función para bloquear usuario después de N intentos fallidos
CREATE OR REPLACE FUNCTION block_user_after_failed_attempts()
RETURNS TRIGGER AS $$
DECLARE
    max_attempts INTEGER := 5;
BEGIN
    IF NEW.failed_login_attempts >= max_attempts THEN
        UPDATE users SET active = false WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER block_user_trigger
    AFTER UPDATE ON users
    FOR EACH ROW
    WHEN (NEW.failed_login_attempts > OLD.failed_login_attempts)
    EXECUTE FUNCTION block_user_after_failed_attempts();
