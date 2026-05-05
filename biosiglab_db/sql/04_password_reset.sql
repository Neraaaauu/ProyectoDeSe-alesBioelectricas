-- =============================================================
--  BioSigLab — Migración: Recuperación de contraseña
--  Agrega columnas para código OTP a la tabla administradores
-- =============================================================

USE biosiglab;

ALTER TABLE administradores
    ADD COLUMN IF NOT EXISTS reset_code       VARCHAR(6)   DEFAULT NULL
        COMMENT 'Código OTP de 6 dígitos para recuperar contraseña',
    ADD COLUMN IF NOT EXISTS reset_code_expiry DATETIME    DEFAULT NULL
        COMMENT 'Expiración del código (15 minutos desde su generación)',
    ADD COLUMN IF NOT EXISTS reset_intentos    TINYINT UNSIGNED NOT NULL DEFAULT 0
        COMMENT 'Intentos fallidos para evitar fuerza bruta';
