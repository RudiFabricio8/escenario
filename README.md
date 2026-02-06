# Sistema de Reportes Académicos (PostgreSQL + Next.js)

Este proyecto es mi solución para la actividad de integración de Base de Datos y Desarrollo Web. El objetivo fue construir un dashboard académico seguro, eficiente y contenerizado.

## Cómo levantar el proyecto

Para ejecutar la aplicación y la base de datos, utilicé **Docker Compose** para asegurar que funcione en cualquier entorno sin instalar dependencias locales.

1.  **Clonar y levantar:**
    ```bash
    docker compose up --build
    ```
    Esto levantará dos contenedores:
    *   `db`: PostgreSQL 15 con todos los scripts de inicialización (`schema`, `seed`, `views`, `roles`).
    *   `app`: Next.js 14 conectado a la BD.

2.  **Acceder:**
    Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Arquitectura y Solución

He dividido el proyecto en capas para mantener el código limpio y seguro, siguiendo las mejores prácticas vistas en clase.

### 1. Base de Datos (PostgreSQL)
Implementé scripts SQL numerados para asegurar el orden de ejecución (`01_schema`, `02_seed`, etc.).

*   **Views (Vistas):** En lugar de consultas complejas en el código, creé 5 vistas optimizadas:
    *   `vw_course_performance`: Calcula promedios y reprobados por curso.
    *   `vw_teacher_load`: Uso de **HAVING** para filtrar docentes con carga.
    *   `vw_students_at_risk`: Uso de **CTE (Common Table Expressions)** para lógica compleja de alumnos en riesgo.
    *   `vw_rank_students`: Uso de **Window Functions (`RANK()`)** para el cuadro de honor.
    *   `vw_attendance_by_group`: Porcentaje de asistencia agrupado.

*   **Seguridad:**
    No me conecto con el usuario `postgres` (root). Creé un rol dedicado `app_user` con permisos restringidos (`GRANT SELECT ON ...`), cumpliendo el requisito de seguridad.

### 2. Backend (Next.js + Zod)
Para la capa de datos (`src/lib/data.ts`):
*   Usé **Zod** para validar estrictamente que los datos que vienen de la BD coincidan con lo esperado (tipado fuerte).
*   Las consultas son parametrizadas (`$1`, `$2`) para evitar inyección SQL.

### 3. Frontend (Dashboard)
Desarrollé una interfaz limpia ("Academic Style") usando **Tailwind CSS**.

*   **Componentes:** Modularicé las tarjetas de métricas en `MetricCard` y `ReportCard` para no repetir código.
*   **Paginación Real:** En el reporte de *Carga Docente*, la paginación ocurre en el servidor (OFFSET/LIMIT SQL), no en el cliente.
*   **Búsqueda:** En *Alumnos en Riesgo*, implementé búsqueda por texto que filtra directamente en la base de datos.
*   **Validación de Inputs:** En *Ranking*, usé una whitelist para restringir los programas permitidos en el dropdown.


## Estado de la Actividad
*   [x] Base de Datos Relacional y Seed Data.
*   [x] Vistas SQL (Aggregates, CTE, Window Functions).
*   [x] Usuario de BD seguro (Read-Only).
*   [x] Dashboard Web funcional.
*   [x] Reportes con filtros y paginación.


## Evidencia de Índices y Optimización

### 1. Búsqueda en Alumnos en Riesgo (ILIKE)
Consulta: `SELECT * FROM vw_students_at_risk WHERE name ILIKE '%Juan%';`

Para verificarlo, ejecutar:
```bash
docker exec escenario_db psql -U postgres -d academia_db -c "EXPLAIN ANALYZE SELECT * FROM vw_students_at_risk WHERE name ILIKE '%Juan%';"
```

**Salida Esperada (Resumida):**
```text
Nested Loop  (cost=... rows=1 width=...) (actual time=0.045..0.048 rows=2 loops=1)
  ->  Seq Scan on students s  (cost=0.00..12.50 rows=1 width=...) (actual time=0.012..0.015 rows=2 loops=1)
        Filter: ((name)::text ~~* '%Juan%'::text)
  ->  Index Scan using idx_enrollments_group_id ...
```

### 2. Filtro de Asistencia (Índice Compuesto)
Consulta interna para calcular `vw_attendance_by_group`. Usa el índice `idx_attendance_enroll_present`.

Para verificarlo:
```bash
docker exec escenario_db psql -U postgres -d academia_db -c "EXPLAIN ANALYZE SELECT COUNT(*) FROM attendance WHERE present = false;"
```

---

## Verificación de Seguridad

El usuario de la aplicación (`app_user`) tiene permisos **estrictamente limitados**.

**Prueba 1: Verificar acceso a VISTAS (Permitido)**
```bash
# Debe devolver la lista de cursos sin error
docker exec escenario_db psql -U app_user -d academia_db -c "SELECT * FROM vw_course_performance LIMIT 1;"
```

**Prueba 2: Verificar bloqueo a TABLAS (Denegado)**
```bash
# Debe devolver ERROR: permission denied for table students
docker exec escenario_db psql -U app_user -d academia_db -c "SELECT * FROM students;"
```

Esto confirma que la aplicación no puede leer ni modificar las tablas base, protegiendo la integridad de los datos.

