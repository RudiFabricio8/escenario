-- Crear usuario limitado
CREATE USER app_user WITH PASSWORD 'app_password_2024';
GRANT CONNECT ON DATABASE academia_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

GRANT SELECT ON ALL VIEWS IN SCHEMA public TO app_user;
-- Revocar cualquier acceso accidental a tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM app_user;