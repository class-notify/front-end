#!/bin/bash

# =====================================================
# SCRIPT PARA CONFIGURAR LA BASE DE DATOS DE AULA-NOTIFY
# =====================================================

echo "🏫 Configurando base de datos para Aula-Notify..."
echo ""

# Verificar si las variables de entorno están configuradas
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ Error: POSTGRES_URL no está configurada"
    echo "Por favor, configura las variables de entorno en tu archivo .env.local"
    exit 1
fi

echo "✅ Variables de entorno detectadas"
echo ""

# Función para ejecutar SQL
execute_sql() {
    local file=$1
    local description=$2
    
    echo "📝 $description..."
    
    if psql "$POSTGRES_URL" -f "$file" > /dev/null 2>&1; then
        echo "✅ $description completado"
    else
        echo "❌ Error ejecutando $description"
        echo "Verifica que tu conexión a la base de datos sea correcta"
        exit 1
    fi
    echo ""
}

# Ejecutar esquema de base de datos
execute_sql "database/schema.sql" "Creando esquema de base de datos"

# Ejecutar datos de ejemplo
execute_sql "database/seed-data.sql" "Insertando datos de ejemplo"

echo "🎉 ¡Base de datos configurada exitosamente!"
echo ""
echo "📊 Resumen de lo que se creó:"
echo "   • 7 tablas principales"
echo "   • 2 vistas útiles"
echo "   • Políticas de seguridad (RLS)"
echo "   • 11 usuarios de ejemplo"
echo "   • 8 materias de ejemplo"
echo "   • 10 aulas de ejemplo"
echo "   • 40+ clases programadas"
echo "   • 15+ suscripciones de ejemplo"
echo "   • 4 notificaciones de ejemplo"
echo ""
echo "🔗 Tu aplicación ya puede conectarse a la base de datos"
echo "🌐 Visita tu aplicación en Vercel para probar la funcionalidad"
