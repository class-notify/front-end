#!/bin/bash

# =====================================================
# SCRIPT PARA CONFIGURAR LA BASE DE DATOS DE SUPABASE
# =====================================================

echo "🏫 Configurando base de datos para Aula-Notify en Supabase..."
echo ""

# Verificar si psql está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql no está instalado"
    echo "Por favor, instala PostgreSQL o psql para continuar"
    exit 1
fi

# Solicitar la contraseña de la base de datos
echo "🔑 Ingresa la contraseña de tu base de datos de Supabase:"
read -s DB_PASSWORD

# Construir la URL de conexión
DB_URL="postgresql://postgres:${DB_PASSWORD}@db.gvuwravjsqiocdkwdyfy.supabase.co:5432/postgres"

echo ""
echo "🔗 Conectando a la base de datos..."

# Probar la conexión
if psql "$DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Conexión exitosa a la base de datos"
else
    echo "❌ Error: No se pudo conectar a la base de datos"
    echo "Verifica que la contraseña sea correcta"
    exit 1
fi

echo ""

# Función para ejecutar SQL
execute_sql() {
    local file=$1
    local description=$2
    
    echo "📝 $description..."
    
    if psql "$DB_URL" -f "$file" > /dev/null 2>&1; then
        echo "✅ $description completado"
    else
        echo "❌ Error ejecutando $description"
        echo "Verifica que tu conexión a la base de datos sea correcta"
        exit 1
    fi
    echo ""
}

# Ejecutar esquema de base de datos
execute_sql "schema.sql" "Creando esquema de base de datos"

# Ejecutar datos de ejemplo
execute_sql "seed-data.sql" "Insertando datos de ejemplo"

echo "🎉 ¡Base de datos configurada exitosamente!"
echo ""
echo "📊 Resumen de lo que se creó:"
echo "   • 7 tablas principales"
echo "   • 2 vistas útiles"
echo "   • Políticas de seguridad (RLS)"
echo "   • 11 usuarios de ejemplo"
echo "   • 8 materias de ejemplo"
echo "   • 10 aulas de ejemplo"
echo "   • 10+ clases programadas"
echo "   • 14+ suscripciones de ejemplo"
echo "   • 4 notificaciones de ejemplo"
echo ""
echo "🔗 Tu aplicación ya puede conectarse a la base de datos"
echo "🌐 Visita http://localhost:3000 para probar la funcionalidad"
echo ""
echo "💡 Datos de acceso de ejemplo:"
echo "   • Admin: admin@university.edu"
echo "   • Docente: maria.gonzalez@university.edu"
echo "   • Estudiante: estudiante1@university.edu" 