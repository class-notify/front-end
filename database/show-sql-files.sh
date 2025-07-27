#!/bin/bash

# =====================================================
# SCRIPT PARA MOSTRAR LOS ARCHIVOS SQL
# =====================================================

echo "📋 CONTENIDO DE LOS ARCHIVOS SQL PARA SUPABASE"
echo "=============================================="
echo ""

echo "🔧 PASO 1: Ejecutar el Schema"
echo "Copia y pega este contenido en el SQL Editor de Supabase:"
echo "=============================================="
echo ""
cat schema.sql
echo ""
echo "=============================================="
echo ""

echo "📊 PASO 2: Ejecutar los Datos de Ejemplo"
echo "Copia y pega este contenido en una nueva query del SQL Editor:"
echo "=============================================="
echo ""
cat seed-data.sql
echo ""
echo "=============================================="
echo ""

echo "✅ PASO 3: Verificar la Configuración"
echo "Ejecuta esta query para verificar que todo se creó correctamente:"
echo "=============================================="
echo ""
echo "-- Verificar tablas creadas"
echo "SELECT table_name"
echo "FROM information_schema.tables"
echo "WHERE table_schema = 'public'"
echo "ORDER BY table_name;"
echo ""
echo "-- Verificar datos insertados"
echo "SELECT 'usuarios' as tabla, COUNT(*) as cantidad FROM usuarios"
echo "UNION ALL"
echo "SELECT 'materias', COUNT(*) FROM materias"
echo "UNION ALL"
echo "SELECT 'aulas', COUNT(*) FROM aulas"
echo "UNION ALL"
echo "SELECT 'clases', COUNT(*) FROM clases"
echo "UNION ALL"
echo "SELECT 'suscripciones', COUNT(*) FROM suscripciones"
echo "UNION ALL"
echo "SELECT 'notificaciones', COUNT(*) FROM notificaciones;"
echo ""
echo "=============================================="
echo ""

echo "🎯 INSTRUCCIONES:"
echo "1. Ve a https://supabase.com/dashboard"
echo "2. Selecciona tu proyecto: gvuwravjsqiocdkwdyfy"
echo "3. Ve a SQL Editor > New query"
echo "4. Ejecuta el schema primero"
echo "5. Crea una nueva query y ejecuta los datos de ejemplo"
echo "6. Ejecuta la query de verificación"
echo ""
echo "🚀 Después de esto, tu base de datos estará lista!"
