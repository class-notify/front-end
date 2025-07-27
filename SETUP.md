# Configuración de Supabase para Class Notify

## 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2dXdyYXZqc3Fpb2Nka3dkeWZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzU1NjgwMSwiZXhwIjoyMDY5MTMyODAxfQ.OzBLK7hKDMUCQ0NEkY_OfDC7LqVP5X_VFZEZrPqMOPY
```

### Cómo obtener estas claves:

1. Ve a [Supabase](https://supabase.com) y crea un nuevo proyecto
2. En el dashboard, ve a Settings > API
3. Copia la URL del proyecto y la anon key
4. Para la service role key, ve a Settings > API > Project API keys

## 2. Configurar la Base de Datos

### Ejecutar el script de configuración:

```bash
cd database
chmod +x setup-database.sh
./setup-database.sh
```

O ejecutar manualmente:

```bash
# Conectar a tu base de datos Supabase
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Ejecutar el schema
\i schema.sql

# Insertar datos de ejemplo
\i seed-data.sql
```

## 3. Estructura de la Base de Datos

El proyecto incluye las siguientes tablas:

- **usuarios**: Usuarios del sistema (admin, suscriptor, docente)
- **materias**: Materias académicas
- **aulas**: Aulas y laboratorios
- **clases**: Clases programadas
- **suscripciones**: Suscripciones de usuarios a materias
- **notificaciones**: Notificaciones del sistema
- **configuraciones_sistema**: Configuraciones globales

### Vistas importantes:

- **clases_completas**: Clases con información completa (materia, aula, docente)
- **suscripciones_completas**: Suscripciones con información completa

## 4. Funcionalidades Implementadas

### API Routes creadas:

- `GET /api/materias` - Obtener todas las materias
- `POST /api/materias` - Crear nueva materia
- `GET /api/materias/[id]` - Obtener materia por ID
- `PUT /api/materias/[id]` - Actualizar materia
- `DELETE /api/materias/[id]` - Eliminar materia

- `GET /api/aulas` - Obtener todas las aulas
- `POST /api/aulas` - Crear nueva aula

- `GET /api/clases` - Obtener clases (con filtros)
- `POST /api/clases` - Crear nueva clase

### Hooks personalizados:

- `useMaterias()` - Manejo de materias
- `useClases(userId?)` - Manejo de clases
- `useSuscripciones(userId)` - Manejo de suscripciones

### Servicios de Supabase:

- `materiasService` - Operaciones CRUD para materias
- `aulasService` - Operaciones CRUD para aulas
- `clasesService` - Operaciones CRUD para clases
- `suscripcionesService` - Operaciones CRUD para suscripciones

## 5. Componentes Actualizados

Los siguientes componentes ahora usan datos reales de Supabase:

- `MateriasPage` - Gestión de materias
- `MateriasTable` - Tabla de materias
- `DashboardSuscriptor` - Dashboard del suscriptor

## 6. Próximos Pasos

1. **Configurar autenticación**: Implementar login/logout con Supabase Auth
2. **Completar CRUD de aulas**: Actualizar componentes de aulas
3. **Implementar notificaciones**: Sistema de notificaciones en tiempo real
4. **Agregar validaciones**: Validación de formularios
5. **Testing**: Pruebas unitarias y de integración

## 7. Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 8. Troubleshooting

### Error de conexión a Supabase:
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el proyecto de Supabase esté activo
- Verifica que las claves API sean correctas

### Error de permisos en la base de datos:
- Verifica que las políticas RLS (Row Level Security) estén configuradas
- Asegúrate de que el usuario tenga permisos para las operaciones necesarias

### Error de tipos TypeScript:
- Ejecuta `npm run build` para verificar errores de tipos
- Asegúrate de que los tipos en `lib/supabase.ts` coincidan con tu esquema 