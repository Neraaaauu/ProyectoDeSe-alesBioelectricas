-- =============================================================
--  BioSigLab — Esquema de Base de Datos
--  Universidad Autónoma de Baja California
--  Compatibilidad: MySQL 8.0+ / MariaDB 10.5+
-- =============================================================

CREATE DATABASE IF NOT EXISTS biosiglab
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE biosiglab;

-- -------------------------------------------------------------
-- TABLA: administradores
-- Usuarios con acceso al panel administrativo
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS administradores (
    id_admin        INT             NOT NULL AUTO_INCREMENT,
    usuario         VARCHAR(60)     NOT NULL UNIQUE,
    clave_hash      VARCHAR(255)    NOT NULL,             -- password_hash() de PHP
    nombre_completo VARCHAR(120),
    correo          VARCHAR(120),
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_admin)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLA: pacientes
-- Datos demográficos de cada paciente con ECG
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pacientes (
    id_paciente     INT             NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(120)    NOT NULL,
    edad            TINYINT UNSIGNED NOT NULL,
    sexo            ENUM('M','F','Otro') NOT NULL,
    ciudad          VARCHAR(80),
    tipo_sangre     ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    notas_clinicas  TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_paciente),
    INDEX idx_ciudad    (ciudad),
    INDEX idx_sexo      (sexo),
    INDEX idx_sangre    (tipo_sangre),
    INDEX idx_edad      (edad)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLA: archivos_xml
-- Archivos ECG en formato XML vinculados a un paciente
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS archivos_xml (
    id_archivo      INT             NOT NULL AUTO_INCREMENT,
    id_paciente     INT             NOT NULL,
    nombre_archivo  VARCHAR(220)    NOT NULL,
    autor           VARCHAR(120)    NOT NULL DEFAULT 'Sistema',
    correo_autor    VARCHAR(120),
    contenido_xml   LONGTEXT        NOT NULL,             -- XML completo
    tamanio_bytes   INT UNSIGNED,
    fecha_subida    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_archivo),
    INDEX idx_paciente  (id_paciente),
    INDEX idx_fecha     (fecha_subida),
    CONSTRAINT fk_xml_paciente
        FOREIGN KEY (id_paciente)
        REFERENCES pacientes(id_paciente)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLA: encuestas
-- Registro de visitantes / usuarios del portal
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS encuestas (
    id_encuesta     INT             NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(120)    NOT NULL,
    correo          VARCHAR(120)    NOT NULL UNIQUE,
    edad            TINYINT UNSIGNED,
    universidad     VARCHAR(160),
    motivo          TEXT,
    aprobado        BOOLEAN         NOT NULL DEFAULT FALSE,
    fecha_registro  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_encuesta),
    INDEX idx_correo    (correo),
    INDEX idx_aprobado  (aprobado)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- TABLA: sesiones_usuario
-- Control de sesiones de visitantes registrados
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sesiones_usuario (
    id_sesion       VARCHAR(64)     NOT NULL,             -- session_id de PHP
    id_encuesta     INT             NOT NULL,
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(255),
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      DATETIME        NOT NULL,
    PRIMARY KEY (id_sesion),
    CONSTRAINT fk_sesion_encuesta
        FOREIGN KEY (id_encuesta)
        REFERENCES encuestas(id_encuesta)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================
-- VISTAS ÚTILES
-- =============================================================

-- Vista: resumen de pacientes con contador de ECG
CREATE OR REPLACE VIEW v_pacientes_resumen AS
    SELECT
        p.id_paciente,
        p.nombre,
        p.edad,
        p.sexo,
        p.ciudad,
        p.tipo_sangre,
        COUNT(a.id_archivo) AS total_ecg,
        MAX(a.fecha_subida)  AS ultimo_ecg
    FROM pacientes p
    LEFT JOIN archivos_xml a ON p.id_paciente = a.id_paciente
    GROUP BY p.id_paciente, p.nombre, p.edad, p.sexo, p.ciudad, p.tipo_sangre;

-- Vista: dashboard de estadísticas para el admin
CREATE OR REPLACE VIEW v_estadisticas AS
    SELECT
        (SELECT COUNT(*) FROM pacientes)                    AS total_pacientes,
        (SELECT COUNT(*) FROM archivos_xml)                 AS total_archivos,
        (SELECT COUNT(DISTINCT ciudad) FROM pacientes)      AS total_ciudades,
        (SELECT COUNT(DISTINCT tipo_sangre) FROM pacientes) AS total_tipos_sangre,
        (SELECT COUNT(*) FROM encuestas)                    AS total_encuestas,
        (SELECT COUNT(*) FROM encuestas WHERE aprobado = TRUE) AS encuestas_aprobadas;
