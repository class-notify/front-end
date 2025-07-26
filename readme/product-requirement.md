# Product Requirements Document (PRD)  
**Aula‑Notify** — Sistema de notificación de aulas universitarias

---

## 1. Visión  
Empoderar a alumnos y docentes con información instantánea y confiable sobre la ubicación de sus clases, eliminando incertidumbre, viajes innecesarios y conflictos de asignación de aulas.

---

## 2. Objetivos  
1. **Reducir viajes ociosos**: avisar cuando una clase se cancela o cambia de aula.  
2. **Evitar solapamientos**: detectar y notificar conflictos de asignación de aulas.  
3. **Mejorar puntualidad**: recordatorios por correo antes de cada clase.  
4. **Facilidad de uso**: UX minimalista, cero fricción en suscripciones y dashboard.

---

## 3. Alcance MVP  
- **Roles**:  
  - **Administrador**: carga/edita materias, horarios y aulas.  
  - **Suscriptor** (alumno/docente): se suscribe a materias, ve dashboard, ajusta alertas.  
- **Notificaciones**:  
  - Email inmediato (asignación, cambio, cancelación).  
  - Email recordatorio X min antes de clase.  
- **Dashboard suscriptor**: vista de próxima semana con estado visual y toggle de alarma.  
- **Limitaciones**:  
  - Carga manual de datos (sin integración API en MVP).  
  - Solo notificaciones por email.

---

## 4. Usuarios y Casos de Uso  

| Usuario        | Objetivo                                         | Flujo principal                                          |
| -------------- | ------------------------------------------------- | -------------------------------------------------------- |
| Administrador  | Gestionar horarios y aulas                       | 1. Login → 2. Carga materia → 3. Define horario/aula → 4. Guarda y dispara notificación si aplica |
| Alumno/Docente | Suscribirse, consultar y recibir alertas          | 1. Login → 2. Lista de materias disponibles → 3. Suscribirse → 4. Ver dashboard → 5. Recibir emails |

---

## 5. Requerimientos Funcionales  

1. **Autenticación**  
   - Magic link o email+contraseña via Supabase Auth.  
2. **Gestión de Materias y Horarios**  
   - CRUD de materias (código, nombre).  
   - CRUD de clases: fecha‑hora, aula (nullable), estado (programada/cancelada).  
   - Validación única: `(aula, inicio)` must be unique.  
3. **Suscripciones**  
   - Tabla `suscripciones(user_id, materia_id, alarma_minutos)`.  
   - UI para suscribir‑/desuscribir materias.  
4. **Dashboard**  
   - Lista de próximas clases (próx. 7 días) filtradas por materias suscritas.  
   - Indicadores:  
     - ⚪ Por asignar (aula null)  
     - 🟢 Asignada  
     - 🔴 Cancelada  
   - Toggle de alarma (on/off) y ajuste de minutos de anticipación.  
5. **Notificaciones**  
   - **Trigger DB** → Supabase Edge Function → n8n/SendGrid.  
   - Envía email al cambio de `aula` o `estado`.  
   - Cron (pg_cron cada 5 min) → Edge Function → recordatorio X min.  

---

## 6. Requerimientos No Funcionales  

- **Performance**: listados y filtros <200 ms.  
- **Escalabilidad**: soportar 3 000 usuarios y ~50 materias.  
- **Seguridad**:  
  - RLS en todas las tablas.  
  - No exponer `SERVICE_ROLE_KEY`.  
  - Validar roles en cada operación.  
- **Disponibilidad**: ≥ 99 %.  
- **Accesibilidad**: WCAG AA; soporte mobile‑first y dark‑mode.  
- **Mantenibilidad**: 80 % de cobertura de tests críticos; componentes <150 líneas.

---

## 7. Métricas de Éxito  

- <5 % de estudiantes llegan a aula equivocada.  
- Tiempo de asignación de aula <1 min tras carga por admin.  
- ≥ 90 % de correos de recordatorio entregados correctamente.  
- ≥ 80 % de usuarios activos con alarma activada.

---

## 8. Milestones y Cronograma  

| Fase         | Tarea                                  | Duración   |
| ------------ | -------------------------------------- | ---------- |
| 1. Kick‑off  | PRD, setup v0.dev + repo GitHub        | 2 días     |
| 2. Backend   | Esquema DB + RLS + triggers + cron     | 3 días     |
| 3. Frontend  | Login, dashboard suscriptor            | 5 días     |
| 4. Admin     | CRUD materias/horarios + UI admin      | 4 días     |
| 5. Notif     | Edge Functions + n8n workflows         | 3 días     |
| 6. QA/Tests  | Pruebas unitarias/end‑to‑end + ajustes | 3 días     |
| 7. Deploy    | Config Vercel, revisión de variables   | 1 día      |
| **Total**    |                                        | **21 días**|

---

## 9. Criterios de Aceptación  

- [ ] Admin puede crear/editar/borrar materias y clases sin error, con validación de conflictos de aula.  
- [ ] Suscriptor se registra, suscribe materias, ve dashboard correcto.  
- [ ] Disparo de emails inmediatos y recordatorios según configuración.  
- [ ] Tests automatizados cubren flujos críticos y todos pasan en CI.  
- [ ] Despliegue listo en Vercel con previews por rama y producción en `main`.  

---

*Fin del PRD.*
::contentReference[oaicite:0]{index=0}
