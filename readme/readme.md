# Aula‑Notify

## Visión de producto
Empoderar a alumnos y docentes con información instantánea y confiable sobre sus aulas, eliminando incertidumbre, viajes innecesarios y conflictos de asignación.

## Requerimiento de producto
- **Suscripción áulica**: usuarios eligen materias y reciben notificaciones.
- **Administración manual**: un admin carga materias, horarios y aulas.
- **Notificaciones por correo**:
  - Asignación, cambio o cancelación de aula.
  - Recordatorios X minutos antes de cada clase.
- **Dashboard minimalista**: muestra próximas clases, estado y alertas configurables.

## Stack
| Capa           | Tecnología                                         |
| -------------- | -------------------------------------------------- |
| Frontend       | Next.js 14 (App Router) + React 18 + Tailwind 3.4  |
| Backend        | Supabase (Postgres, Auth, Edge Functions)          |
| Orquestación   | n8n (Webhooks + envíos de email)                   |
| Deploy         | Vercel (Previews por rama y Production en `main`)  |

## Design System
- **Colores**  
  - Primario `#0050FF` – botones, enlaces  
  - Secundario `#FF5722` – acentos  
  - Neutros `#F9FAFB` (fondo), `#1A202C` (texto)
- **Tipografía**  
  - Fuente: Inter  
  - Escalas: `text-xl`, `text-base`, `text-sm`
- **Espaciado & Sombras**  
  - Padding: `p-2` (8 px), `p-4` (16 px)  
  - Bordes: `rounded-lg`  
  - Sombras: `shadow-sm`
- **Componentes reutilizables** (en `/components/ui`)
  - `<Button variant="primary|outline|secondary" size="sm|md|lg" />`
  - `<Card>…</Card>` para tarjetas de clase
  - `<Badge status="pending|assigned|cancelled" />`
  - `<Modal>` y `<Form>` para CRUD de admin
  - `<Toast>` para feedback de acciones

## Pantallas clave
1. **Login**  
   - Email + magic link vía Supabase Auth  
2. **Onboarding Admin**  
   - Formulario de carga de Materias y Horarios  
3. **Gestión de Clases**  
   - Listado con filtros, creación/edición de horarios y aulas  
4. **Dashboard Suscriptor**  
   - Lista o calendario de próximas clases (próxima semana)  
   - Estado visual:  
     - ⚪ Por asignar  
     - 🟢 Asignada  
     - 🔴 Cancelada  
   - Toggle para “Alarma e‑mail ⏰”  
5. **Detalle de Clase**  
   - Datos de aula, fecha/hora, enlace rápido al calendario  
6. **Configuración de Usuario**  
   - Ajuste de minutos de anticipación  
   - Preferencia Dark/Light mode  
7. **404 / Error**  
   - Mensaje claro y botón de regreso al dashboard

## Reglas de trabajo
- **Ramas**: `feature/<descripción>`, `fix/<ticket>`
- **Commits**: estilo imperativo; referenciar tarea o issue
- **PRs**: título claro, descripción de cambios, checklist de tests
- **Calidad**:
  - `pnpm lint && pnpm test` pasan en CI
  - Cobertura mínima del 80% en lógica crítica
- **Revisiones IA**:  
  - Cursor/v0 generan código; el dev valida lógicas, seguridad y RLS
  - No aceptar diffs sin pruebas o sin validación de compilación (`npm run typecheck`)
- **Componentes**:  
  - Crear siempre en `/components/ui`  
  - Reutilizar, parametrizar con props; evitar copia/pega

## Cómo ejecutar
1. Clona y `cd aula-notify`
2. `pnpm install && pnpm dev`  
3. Copia `.env.example → .env.local`  
   - `NEXT_PUBLIC_SUPABASE_URL`  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `SUPABASE_SERVICE_ROLE_KEY` (solo backend)  
   - `EMAIL_WEBHOOK_URL` (n8n)  
   - `SENDGRID_API_KEY` o `RESEND_API_KEY`
4. `supabase start` (opcional, local)
5. Push a `main` → despliegue automático en Vercel

---

Este README define la **visión**, **requisitos**, **diseño**, **pantallas**, **reglas de trabajo** y la **estructura de componentes**. Úsalo como guía única: sé claro, conciso y evita redundancias en tus prompts y generación de código.
::contentReference[oaicite:0]{index=0}
