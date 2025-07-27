# 🏫 Aula-Notify

Sistema de notificación de aulas universitarias que permite a los estudiantes recibir alertas sobre cambios en sus clases y gestionar sus suscripciones a materias.

## ✨ Características

### 👨‍💼 **Panel de Administrador**
- **Gestión de Materias**: Crear, editar y eliminar materias
- **Gestión de Aulas**: Administrar aulas y su equipamiento
- **Gestión de Horarios**: Programar clases y asignar aulas
- **Dashboard completo**: Estadísticas y vista general del sistema

### 👨‍🎓 **Panel de Estudiante**
- **Dashboard personalizado**: Vista de próximas clases
- **Búsqueda de materias**: Explorar y suscribirse a nuevas materias
- **Configuración de alarmas**: Personalizar notificaciones por materia
- **Vista de calendario**: Visualización temporal de clases
- **Notificaciones inteligentes**: Alertas sobre cambios y cancelaciones

## 🚀 Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Validación**: Zod
- **Gestión de Estado**: React Hooks

## 🎨 Design System

- **Colores Primarios**: `#0050FF` (azul)
- **Colores Secundarios**: `#FF5722` (naranja)
- **Fondo Neutro**: `#F9FAFB`
- **Texto Neutro**: `#1A202C`

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm
- Cuenta de Supabase

### Pasos de instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/tu-usuario/class-notify.git
cd class-notify
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
# o
pnpm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Editar `.env.local` con tus credenciales de Supabase:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
\`\`\`

4. **Ejecutar en desarrollo**
\`\`\`bash
npm run dev
# o
pnpm dev
\`\`\`

5. **Abrir en el navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 🗄️ Estructura de la Base de Datos

### Tablas principales:
- `materias`: Información de materias universitarias
- `aulas`: Aulas disponibles con capacidad y equipamiento
- `docentes`: Información de profesores
- `clases`: Horarios y programación de clases
- `suscripciones`: Suscripciones de estudiantes a materias
- `usuarios`: Perfiles de usuarios del sistema

## 🔧 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
\`\`\`

## 📱 Uso del Sistema

### Para Administradores:
1. Acceder con credenciales de administrador
2. Gestionar materias desde el panel de administración
3. Crear y asignar aulas
4. Programar horarios de clases
5. Monitorear estadísticas del sistema

### Para Estudiantes:
1. Registrarse o iniciar sesión
2. Explorar materias disponibles
3. Suscribirse a materias de interés
4. Configurar preferencias de notificación
5. Revisar dashboard de próximas clases

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, puedes:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

## 🚧 Estado del Proyecto

- ✅ Frontend completo con Next.js
- ✅ Design system implementado
- ✅ Componentes UI reutilizables
- ✅ Dashboard de administrador
- ✅ Dashboard de estudiante
- ✅ Sistema de búsqueda de materias
- 🔄 Integración con Supabase (en progreso)
- 🔄 Sistema de autenticación (en progreso)
- 🔄 Notificaciones en tiempo real (pendiente)

---

**Desarrollado con ❤️ para mejorar la experiencia educativa**
