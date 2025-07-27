-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA AULA-NOTIFY
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: usuarios (perfiles de usuarios)
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'suscriptor' CHECK (rol IN ('admin', 'suscriptor', 'docente')),
    telefono VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: materias
-- =====================================================
CREATE TABLE IF NOT EXISTS materias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    creditos INTEGER DEFAULT 0,
    docente_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: aulas
-- =====================================================
CREATE TABLE IF NOT EXISTS aulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    capacidad INTEGER NOT NULL DEFAULT 30,
    equipamiento TEXT[], -- Array de equipamiento disponible
    tipo VARCHAR(50) DEFAULT 'aula' CHECK (tipo IN ('aula', 'laboratorio', 'auditorio', 'sala_computacion')),
    estado VARCHAR(50) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'mantenimiento', 'ocupada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: clases (horarios)
-- =====================================================
CREATE TABLE IF NOT EXISTS clases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    materia_id UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    aula_id UUID REFERENCES aulas(id) ON DELETE SET NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada' CHECK (estado IN ('programada', 'en_curso', 'finalizada', 'cancelada')),
    motivo_cancelacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para evitar solapamiento de horarios en la misma aula
    CONSTRAINT unique_aula_horario UNIQUE (aula_id, fecha, hora_inicio, hora_fin)
);

-- =====================================================
-- TABLA: suscripciones (estudiantes suscritos a materias)
-- =====================================================
CREATE TABLE IF NOT EXISTS suscripciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    materia_id UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
    alarma_minutos INTEGER NOT NULL DEFAULT 15,
    alarma_activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario solo puede estar suscrito una vez a cada materia
    CONSTRAINT unique_user_materia UNIQUE (user_id, materia_id)
);

-- =====================================================
-- TABLA: notificaciones
-- =====================================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    clase_id UUID REFERENCES clases(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('recordatorio', 'cambio_aula', 'cancelacion', 'nueva_clase')),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT false,
    enviada BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: configuraciones_sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS configuraciones_sistema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =====================================================

-- Índices para materias
CREATE INDEX IF NOT EXISTS idx_materias_codigo ON materias(codigo);
CREATE INDEX IF NOT EXISTS idx_materias_docente ON materias(docente_id);

-- Índices para aulas
CREATE INDEX IF NOT EXISTS idx_aulas_codigo ON aulas(codigo);
CREATE INDEX IF NOT EXISTS idx_aulas_estado ON aulas(estado);

-- Índices para clases
CREATE INDEX IF NOT EXISTS idx_clases_materia ON clases(materia_id);
CREATE INDEX IF NOT EXISTS idx_clases_aula ON clases(aula_id);
CREATE INDEX IF NOT EXISTS idx_clases_fecha ON clases(fecha);
CREATE INDEX IF NOT EXISTS idx_clases_estado ON clases(estado);
CREATE INDEX IF NOT EXISTS idx_clases_fecha_hora ON clases(fecha, hora_inicio);

-- Índices para suscripciones
CREATE INDEX IF NOT EXISTS idx_suscripciones_user ON suscripciones(user_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_materia ON suscripciones(materia_id);

-- Índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notificaciones_user ON notificaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX IF NOT EXISTS idx_notificaciones_created ON notificaciones(created_at);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materias_updated_at BEFORE UPDATE ON materias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aulas_updated_at BEFORE UPDATE ON aulas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clases_updated_at BEFORE UPDATE ON clases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suscripciones_updated_at BEFORE UPDATE ON suscripciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuraciones_updated_at BEFORE UPDATE ON configuraciones_sistema FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (email, nombre, apellido, rol) 
VALUES ('admin@university.edu', 'Administrador', 'Sistema', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertar configuraciones por defecto
INSERT INTO configuraciones_sistema (clave, valor, descripcion) VALUES
('sistema_activo', 'true', 'Indica si el sistema está activo'),
('alarma_por_defecto', '15', 'Minutos de anticipación por defecto para alarmas'),
('max_suscripciones_por_usuario', '10', 'Máximo número de materias a las que puede suscribirse un usuario'),
('notificaciones_email_activas', 'true', 'Indica si las notificaciones por email están activas')
ON CONFLICT (clave) DO NOTHING;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para clases con información completa
CREATE OR REPLACE VIEW clases_completas AS
SELECT 
    c.id,
    c.fecha,
    c.hora_inicio,
    c.hora_fin,
    c.estado,
    c.motivo_cancelacion,
    m.id as materia_id,
    m.codigo as materia_codigo,
    m.nombre as materia_nombre,
    a.id as aula_id,
    a.codigo as aula_codigo,
    a.nombre as aula_nombre,
    a.ubicacion as aula_ubicacion,
    a.capacidad as aula_capacidad,
    u.id as docente_id,
    u.nombre as docente_nombre,
    u.apellido as docente_apellido,
    u.email as docente_email,
    c.created_at,
    c.updated_at
FROM clases c
JOIN materias m ON c.materia_id = m.id
LEFT JOIN aulas a ON c.aula_id = a.id
LEFT JOIN usuarios u ON m.docente_id = u.id;

-- Vista para suscripciones con información completa
CREATE OR REPLACE VIEW suscripciones_completas AS
SELECT 
    s.id,
    s.alarma_minutos,
    s.alarma_activa,
    s.created_at,
    u.id as user_id,
    u.email as user_email,
    u.nombre as user_nombre,
    u.apellido as user_apellido,
    m.id as materia_id,
    m.codigo as materia_codigo,
    m.nombre as materia_nombre,
    d.id as docente_id,
    d.nombre as docente_nombre,
    d.apellido as docente_apellido,
    d.email as docente_email
FROM suscripciones s
JOIN usuarios u ON s.user_id = u.id
JOIN materias m ON s.materia_id = m.id
LEFT JOIN usuarios d ON m.docente_id = d.id;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clases ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_sistema ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (se pueden ajustar según necesidades específicas)
-- Usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" ON usuarios
    FOR SELECT USING (auth.uid() = id);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON usuarios
    FOR UPDATE USING (auth.uid() = id);

-- Todos pueden ver materias
CREATE POLICY "Todos pueden ver materias" ON materias
    FOR SELECT USING (true);

-- Solo admins pueden modificar materias
CREATE POLICY "Solo admins pueden modificar materias" ON materias
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Todos pueden ver aulas
CREATE POLICY "Todos pueden ver aulas" ON aulas
    FOR SELECT USING (true);

-- Solo admins pueden modificar aulas
CREATE POLICY "Solo admins pueden modificar aulas" ON aulas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Todos pueden ver clases
CREATE POLICY "Todos pueden ver clases" ON clases
    FOR SELECT USING (true);

-- Solo admins pueden modificar clases
CREATE POLICY "Solo admins pueden modificar clases" ON clases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Usuarios pueden ver sus propias suscripciones
CREATE POLICY "Usuarios pueden ver sus suscripciones" ON suscripciones
    FOR SELECT USING (auth.uid() = user_id);

-- Usuarios pueden modificar sus propias suscripciones
CREATE POLICY "Usuarios pueden modificar sus suscripciones" ON suscripciones
    FOR ALL USING (auth.uid() = user_id);

-- Usuarios pueden ver sus propias notificaciones
CREATE POLICY "Usuarios pueden ver sus notificaciones" ON notificaciones
    FOR SELECT USING (auth.uid() = user_id);

-- Usuarios pueden actualizar sus propias notificaciones
CREATE POLICY "Usuarios pueden actualizar sus notificaciones" ON notificaciones
    FOR UPDATE USING (auth.uid() = user_id);

-- Solo admins pueden ver configuraciones del sistema
CREATE POLICY "Solo admins pueden ver configuraciones" ON configuraciones_sistema
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Solo admins pueden modificar configuraciones del sistema
CREATE POLICY "Solo admins pueden modificar configuraciones" ON configuraciones_sistema
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );
