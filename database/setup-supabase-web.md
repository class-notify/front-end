# 🏫 Configuración de Base de Datos - Supabase Web

## 📋 Pasos para configurar la base de datos usando el SQL Editor de Supabase

### 1. Acceder al SQL Editor de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `gvuwravjsqiocdkwdyfy`
3. En el menú lateral, haz clic en **SQL Editor**
4. Haz clic en **New query**

### 2. Ejecutar el Schema

1. Copia todo el contenido del archivo `schema.sql`
2. Pégalo en el SQL Editor
3. Haz clic en **Run** para ejecutar

### 3. Ejecutar los Datos de Ejemplo

1. Crea una nueva query
2. Copia todo el contenido del archivo `seed-data.sql`
3. Pégalo en el SQL Editor
4. Haz clic en **Run** para ejecutar

### 4. Verificar la Configuración

Ejecuta esta query para verificar que todo se creó correctamente:

```sql
-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar datos insertados
SELECT 'usuarios' as tabla, COUNT(*) as cantidad FROM usuarios
UNION ALL
SELECT 'materias', COUNT(*) FROM materias
UNION ALL
SELECT 'aulas', COUNT(*) FROM aulas
UNION ALL
SELECT 'clases', COUNT(*) FROM clases
UNION ALL
SELECT 'suscripciones', COUNT(*) FROM suscripciones
UNION ALL
SELECT 'notificaciones', COUNT(*) FROM notificaciones;
```

## 🎯 Datos de Acceso de Ejemplo

Una vez configurada la base de datos, puedes usar estos datos para probar:

### Usuarios de Prueba:
- **Admin**: `admin@university.edu`
- **Docente**: `maria.gonzalez@university.edu`
- **Estudiante**: `estudiante1@university.edu`

### Materias de Ejemplo:
- MAT101 - Matemática I
- FIS201 - Física II
- QUI301 - Química Orgánica
- BIO401 - Biología Molecular
- PRO501 - Programación I
- EST601 - Estadística
- CAL701 - Cálculo Avanzado
- LAB801 - Laboratorio de Física

### Aulas de Ejemplo:
- A101 - Aula Magna Norte (120 personas)
- B205 - Laboratorio de Química (30 personas)
- C301 - Sala de Informática (40 personas)
- D102 - Aula Teórica (60 personas)
- E201 - Auditorio Central (200 personas)

## 🔧 Configuración de Políticas RLS

Después de ejecutar el schema, las políticas de seguridad (RLS) estarán configuradas automáticamente. Si necesitas modificarlas:

1. Ve a **Authentication** > **Policies**
2. Revisa las políticas creadas para cada tabla
3. Modifica según tus necesidades de seguridad

## 🚀 Próximos Pasos

1. **Configurar la Service Role Key** en tu archivo `.env.local`
2. **Reiniciar el servidor**: `npm run dev`
3. **Probar la aplicación**: Ve a http://localhost:3000
4. **Verificar que los datos se cargan** desde Supabase

## 🔍 Troubleshooting

### Error: "relation does not exist"
- Asegúrate de ejecutar primero el `schema.sql`
- Verifica que estés en el proyecto correcto de Supabase

### Error: "duplicate key value"
- Los datos ya existen, puedes ignorar este error
- O ejecuta primero: `DELETE FROM notificaciones; DELETE FROM suscripciones; DELETE FROM clases; DELETE FROM materias; DELETE FROM aulas; DELETE FROM usuarios;`

### Error de conexión desde la aplicación
- Verifica que la Service Role Key esté configurada correctamente
- Revisa las políticas RLS en Supabase
- Asegúrate de que el proyecto esté activo

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en el SQL Editor de Supabase
2. Verifica la documentación de Supabase
3. Consulta los logs de tu aplicación Next.js 