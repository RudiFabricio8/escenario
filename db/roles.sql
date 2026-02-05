CREATE USER app_user WITH PASSWORD 'app_secure_123';
GRANT CONNECT ON DATABASE academia_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT ON ALL VIEWS IN SCHEMA public TO app_user;

-- Denegar acceso a tablas para forzar uso de VIEWS
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;