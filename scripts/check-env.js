#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de variables de entorno...\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró el archivo .env.local');
  console.log('📝 Crea el archivo .env.local con las siguientes variables:');
  console.log('');
  console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key');
  process.exit(1);
}

// Leer el archivo .env.local
const envContent = fs.readFileSync(envPath, 'utf8');

// Verificar variables requeridas
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingVars = [];
const placeholderVars = [];

requiredVars.forEach(varName => {
  if (!envContent.includes(varName)) {
    missingVars.push(varName);
  } else if (envContent.includes(`${varName}=your_`) || envContent.includes(`${varName}=tu_`)) {
    placeholderVars.push(varName);
  }
});

console.log('📋 Variables de entorno encontradas:');

if (missingVars.length > 0) {
  console.error(`❌ Variables faltantes: ${missingVars.join(', ')}`);
  console.log('');
  console.log('📝 Agrega las variables faltantes a tu archivo .env.local');
}

if (placeholderVars.length > 0) {
  console.warn(`⚠️  Variables con valores placeholder: ${placeholderVars.join(', ')}`);
  console.log('');
  console.log('🔑 Para obtener las claves de Supabase:');
  console.log('1. Ve a https://supabase.com/dashboard');
  console.log('2. Selecciona tu proyecto');
  console.log('3. Ve a Settings > API');
  console.log('4. Copia las claves correspondientes');
}

const validVars = requiredVars.filter(varName => 
  !missingVars.includes(varName) && !placeholderVars.includes(varName)
);

if (validVars.length === requiredVars.length) {
  console.log('✅ Todas las variables están configuradas correctamente');
  console.log('');
  console.log('🚀 Puedes ejecutar la aplicación con: npm run dev');
} else {
  console.log('');
  console.log('📝 Ejemplo de archivo .env.local completo:');
  console.log('');
  console.log('# Supabase Configuration');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('');
  console.log('# Environment');
  console.log('NODE_ENV=development');
}

console.log('');
