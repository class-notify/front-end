-- =====================================================
-- DATOS DE EJEMPLO PARA AULA-NOTIFY
-- =====================================================

-- Limpiar datos existentes (en orden inverso por dependencias)
DELETE FROM notificaciones;
DELETE FROM suscripciones;
DELETE FROM clases;
DELETE FROM materias;
DELETE FROM aulas;
DELETE FROM usuarios;
DELETE FROM configuraciones_sistema;

-- =====================================================
-- USUARIOS DE EJEMPLO
-- =====================================================
INSERT INTO usuarios (id, email, nombre, apellido, rol, telefono) VALUES
-- Administradores
('550e8400-e29b-41d4-a716-446655440001', 'admin@university.edu', 'Admin', 'Sistema', 'admin', '+54 11 1234-5678'),

-- Docentes
('550e8400-e29b-41d4-a716-446655440002', 'maria.gonzalez@university.edu', 'María', 'González', 'docente', '+54 11 1234-5679'),
('550e8400-e29b-41d4-a716-446655440003', 'juan.perez@university.edu', 'Juan', 'Pérez', 'docente', '+54 11 1234-5680'),
('550e8400-e29b-41d4-a716-446655440004', 'ana.rodriguez@university.edu', 'Ana', 'Rodríguez', 'docente', '+54 11 1234-5681'),
('550e8400-e29b-41d4-a716-446655440005', 'carlos.mendoza@university.edu', 'Carlos', 'Mendoza', 'docente', '+54 11 1234-5682'),

-- Estudiantes
('550e8400-e29b-41d4-a716-446655440006', 'estudiante1@university.edu', 'Lucas', 'Martínez', 'suscriptor', '+54 11 1234-5683'),
('550e8400-e29b-41d4-a716-446655440007', 'estudiante2@university.edu', 'Sofía', 'López', 'suscriptor', '+54 11 1234-5684'),
('550e8400-e29b-41d4-a716-446655440008', 'estudiante3@university.edu', 'Diego', 'Fernández', 'suscriptor', '+54 11 1234-5685'),
('550e8400-e29b-41d4-a716-446655440009', 'estudiante4@university.edu', 'Valentina', 'García', 'suscriptor', '+54 11 1234-5686'),
('550e8400-e29b-41d4-a716-446655440010', 'estudiante5@university.edu', 'Mateo', 'Silva', 'suscriptor', '+54 11 1234-5687'),
('550e8400-e29b-41d4-a716-446655440011', 'estudiante6@university.edu', 'Isabella', 'Torres', 'suscriptor', '+54 11 1234-5688');

-- =====================================================
-- MATERIAS DE EJEMPLO
-- =====================================================
INSERT INTO materias (id, codigo, nombre, descripcion, creditos, docente_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'MAT101', 'Matemática I', 'Fundamentos de matemática para ingeniería', 4, '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440002', 'FIS201', 'Física II', 'Física avanzada para ingenieros', 3, '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440003', 'QUI301', 'Química Orgánica', 'Química orgánica básica', 4, '550e8400-e29b-41d4-a716-446655440004'),
('660e8400-e29b-41d4-a716-446655440004', 'BIO401', 'Biología Molecular', 'Fundamentos de biología molecular', 3, '550e8400-e29b-41d4-a716-446655440005'),
('660e8400-e29b-41d4-a716-446655440005', 'PRO501', 'Programación I', 'Introducción a la programación', 4, '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440006', 'EST601', 'Estadística', 'Estadística aplicada', 3, '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440007', 'CAL701', 'Cálculo Avanzado', 'Cálculo diferencial e integral', 4, '550e8400-e29b-41d4-a716-446655440004'),
('660e8400-e29b-41d4-a716-446655440008', 'LAB801', 'Laboratorio de Física', 'Prácticas de laboratorio', 2, '550e8400-e29b-41d4-a716-446655440005');

-- =====================================================
-- AULAS DE EJEMPLO
-- =====================================================
INSERT INTO aulas (id, codigo, nombre, ubicacion, capacidad, equipamiento, tipo, estado) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'A101', 'Aula Magna Norte', 'Edificio A - Planta Baja', 120, ARRAY['Proyector', 'Audio', 'Pizarra Digital', 'AC'], 'aula', 'disponible'),
('770e8400-e29b-41d4-a716-446655440002', 'B205', 'Laboratorio de Química', 'Edificio B - Segundo Piso', 30, ARRAY['Campana Extractora', 'Mesadas', 'Ducha de Emergencia'], 'laboratorio', 'disponible'),
('770e8400-e29b-41d4-a716-446655440003', 'C301', 'Sala de Informática', 'Edificio C - Tercer Piso', 40, ARRAY['30 PCs', 'Proyector', 'Pizarra', 'AC'], 'sala_computacion', 'disponible'),
('770e8400-e29b-41d4-a716-446655440004', 'D102', 'Aula Teórica', 'Edificio D - Primer Piso', 60, ARRAY['Proyector', 'Pizarra'], 'aula', 'disponible'),
('770e8400-e29b-41d4-a716-446655440005', 'E201', 'Auditorio Central', 'Edificio E - Segundo Piso', 200, ARRAY['Proyector HD', 'Audio Surround', 'Escenario'], 'auditorio', 'disponible'),
('770e8400-e29b-41d4-a716-446655440006', 'F103', 'Laboratorio de Física', 'Edificio F - Primer Piso', 25, ARRAY['Osciloscopios', 'Multímetros', 'Generadores'], 'laboratorio', 'disponible'),
('770e8400-e29b-41d4-a716-446655440007', 'G401', 'Aula de Matemáticas', 'Edificio G - Cuarto Piso', 45, ARRAY['Pizarra', 'Proyector'], 'aula', 'disponible'),
('770e8400-e29b-41d4-a716-446655440008', 'H202', 'Sala de Conferencias', 'Edificio H - Segundo Piso', 80, ARRAY['Proyector', 'Audio', 'Micrófonos'], 'aula', 'disponible'),
('770e8400-e29b-41d4-a716-446655440009', 'I105', 'Laboratorio de Biología', 'Edificio I - Primer Piso', 35, ARRAY['Microscopios', 'Incubadoras', 'Centrífugas'], 'laboratorio', 'disponible'),
('770e8400-e29b-41d4-a716-446655440010', 'J303', 'Aula de Programación', 'Edificio J - Tercer Piso', 50, ARRAY['25 PCs', 'Proyector', 'Pizarra'], 'sala_computacion', 'disponible');

-- =====================================================
-- CLASES DE EJEMPLO (próximas 2 semanas)
-- =====================================================
INSERT INTO clases (id, materia_id, aula_id, fecha, hora_inicio, hora_fin, estado) VALUES
-- Hoy
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, '14:00', '16:00', 'programada'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440006', CURRENT_DATE, '16:00', '18:00', 'programada'),

-- Mañana
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '1 day', '08:00', '10:00', 'programada'),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440009', CURRENT_DATE + INTERVAL '1 day', '10:00', '12:00', 'programada'),

-- Pasado mañana
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '2 days', '14:00', '16:00', 'programada'),
('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440007', CURRENT_DATE + INTERVAL '2 days', '16:00', '18:00', 'programada'),

-- Esta semana
('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '3 days', '08:00', '10:00', 'programada'),
('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440006', CURRENT_DATE + INTERVAL '3 days', '10:00', '12:00', 'programada'),

-- Próxima semana
('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '7 days', '14:00', '16:00', 'programada'),
('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', CURRENT_DATE + INTERVAL '7 days', '16:00', '18:00', 'programada');

-- =====================================================
-- SUSCRIPCIONES DE EJEMPLO
-- =====================================================
INSERT INTO suscripciones (id, user_id, materia_id, alarma_minutos, alarma_activa) VALUES
-- Estudiante 1 suscrito a varias materias
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', 15, true),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 30, true),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005', 20, false),

-- Estudiante 2 suscrito a otras materias
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 15, true),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', 25, true),
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440006', 10, true),

-- Estudiante 3
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', 15, true),
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440007', 30, false),

-- Estudiante 4
('990e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440002', 20, true),
('990e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440008', 15, true),

-- Estudiante 5
('990e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440003', 25, true),
('990e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440005', 10, true),

-- Estudiante 6
('990e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440004', 15, true),
('990e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440006', 20, false);

-- =====================================================
-- NOTIFICACIONES DE EJEMPLO
-- =====================================================
INSERT INTO notificaciones (id, user_id, clase_id, tipo, titulo, mensaje, leida, enviada) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440001', 'recordatorio', 'Recordatorio de Clase', 'Tu clase de Matemática I comienza en 15 minutos', false, true),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440003', 'recordatorio', 'Recordatorio de Clase', 'Tu clase de Química Orgánica comienza en 30 minutos', false, true),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440005', 'cambio_aula', 'Cambio de Aula', 'Tu clase de Programación I se realizará en la Sala C301', true, true),
('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440009', '880e8400-e29b-41d4-a716-446655440002', 'cancelacion', 'Clase Cancelada', 'La clase de Física II ha sido cancelada por mantenimiento del laboratorio', false, true);

-- =====================================================
-- CONFIGURACIONES DEL SISTEMA
-- =====================================================
INSERT INTO configuraciones_sistema (id, clave, valor, descripcion) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'alarma_por_defecto', '15', 'Minutos de anticipación por defecto para recordatorios'),
('bb0e8400-e29b-41d4-a716-446655440002', 'max_alarma_minutos', '120', 'Máximo de minutos de anticipación permitido'),
('bb0e8400-e29b-41d4-a716-446655440003', 'notificaciones_activas', 'true', 'Sistema de notificaciones activo'),
('bb0e8400-e29b-41d4-a716-446655440004', 'max_suscripciones_usuario', '10', 'Máximo número de suscripciones por usuario'),
('bb0e8400-e29b-41d4-a716-446655440005', 'capacidad_aula_minima', '10', 'Capacidad mínima para un aula');

-- =====================================================
-- RESETEO DE SECUENCIAS (si es necesario)
-- =====================================================
-- Nota: Como usamos UUIDs, no necesitamos resetear secuencias
