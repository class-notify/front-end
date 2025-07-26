# 🗄️ Base de Datos - Aula-Notify

Este directorio contiene todos los archivos necesarios para configurar la base de datos de Aula-Notify en Supabase.

## 📁 Archivos

- **`schema.sql`** - Esquema completo de la base de datos
- **`seed-data.sql`** - Datos de ejemplo para poblar la base de datos
- **`setup-database.sh`** - Script automatizado para configurar todo
- **`README.md`** - Este archivo

## 🚀 Configuración Rápida

### Opción 1: Script Automatizado (Recomendado)

1. **Asegúrate de tener las variables de entorno configuradas** en tu `.env.local`:
```env
POSTGRES_URL="postgres://postgres.gvuwravjsqiocdkwdyfy:H1MTOVm7XDi67jOF@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
```

2. **Ejecuta el script de configuración**:
```bash
./database/setup-database.sh
```

### Opción 2: Configuración Manual

1. **Accede al SQL Editor de Supabase**:
   - Ve a tu proyecto en Supabase
   - Navega a "SQL Editor"
   - Crea un nuevo query

2. **Ejecuta el esquema**:
   - Copia y pega el contenido de `schema.sql`
   - Ejecuta el query

3. **Inserta datos de ejemplo**:
   - Copia y pega el contenido de `seed-data.sql`
   - Ejecuta el query

## 🏗️ Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Perfiles de usuarios (admin, docente, suscriptor) |
| `materias` | Materias universitarias |
| `aulas` | Aulas disponibles con equipamiento |
| `clases` | Horarios y programación de clases |
| `suscripciones` | Suscripciones de estudiantes a materias |
| `notificaciones` | Notificaciones del sistema |
| `configuraciones_sistema` | Configuraciones globales |

### Vistas Útiles

| Vista | Descripción |
|-------|-------------|
| `clases_completas` | Clases con información de materia, aula y docente |
| `suscripciones_completas` | Suscripciones con información de usuario y materia |

### Políticas de Seguridad (RLS)

- **Usuarios**: Solo pueden ver/modificar su propio perfil
- **Materias/Aulas/Clases**: Lectura pública, escritura solo para admins
- **Suscripciones**: Usuarios solo pueden ver/modificar las suyas
- **Notificaciones**: Usuarios solo pueden ver las suyas
- **Configuraciones**: Solo admins pueden acceder

## 📊 Datos de Ejemplo Incluidos

### Usuarios
- **1 Administrador**: `admin@university.edu`
- **6 Docentes**: Con información completa
- **5 Estudiantes**: Para pruebas

### Materias
- **8 Materias**: Matemática, Física, Química, Biología, Programación, Economía, Historia, Filosofía
- **Algunas con docente asignado**, otras sin asignar

### Aulas
- **10 Aulas**: Diferentes tipos (aula, laboratorio, auditorio, sala de computación)
- **Equipamiento variado**: Proyectores, computadoras, equipos de laboratorio

### Clases
- **40+ Clases**: Programadas para las próximas 2 semanas
- **Diferentes estados**: Programadas, por asignar, canceladas

### Suscripciones
- **15+ Suscripciones**: Estudiantes suscritos a diferentes materias
- **Configuraciones variadas**: Diferentes minutos de anticipación

## 🔧 Comandos Útiles

### Verificar conexión
```bash
psql "$POSTGRES_URL" -c "SELECT version();"
```

### Ver tablas creadas
```bash
psql "$POSTGRES_URL" -c "\dt"
```

### Ver datos de ejemplo
```bash
psql "$POSTGRES_URL" -c "SELECT * FROM usuarios LIMIT 5;"
```

### Ver clases programadas
```bash
psql "$POSTGRES_URL" -c "SELECT * FROM clases_completas LIMIT 5;"
```

## 🚨 Solución de Problemas

### Error: "connection refused"
- Verifica que `POSTGRES_URL` esté correcta
- Asegúrate de que tu IP esté en la whitelist de Supabase

### Error: "permission denied"
- Verifica que las credenciales sean correctas
- Asegúrate de usar la URL de pooler para conexiones externas

### Error: "table already exists"
- Las tablas se crean con `IF NOT EXISTS`, así que es seguro ejecutar múltiples veces

## 🔄 Actualizaciones

Para actualizar la base de datos después de cambios:

1. **Hacer backup** (opcional):
```bash
pg_dump "$POSTGRES_URL" > backup_$(date +%Y%m%d_%H%M%S).sql
```

2. **Ejecutar solo los cambios necesarios** en el SQL Editor de Supabase

## 📝 Notas Importantes

- **UUIDs**: Todas las tablas usan UUIDs como claves primarias
- **Timestamps**: Todas las tablas tienen `created_at` y `updated_at`
- **Triggers**: Los timestamps se actualizan automáticamente
- **Constraints**: Se incluyen constraints para evitar datos inconsistentes
- **Índices**: Se crean índices para optimizar consultas frecuentes

---

**¡Tu base de datos está lista para usar con Aula-Notify!** 🎉 