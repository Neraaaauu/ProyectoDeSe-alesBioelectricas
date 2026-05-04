-- ============================================================
--  BioSigLab — Migración: Columnas biométricas en administradores
--  Ejecutar en phpMyAdmin después de 01_schema.sql
-- ============================================================

USE biosiglab;

-- Columna para el descriptor facial (128 floats como JSON)
ALTER TABLE administradores
    ADD COLUMN IF NOT EXISTS face_descriptor  JSON          NULL
        COMMENT 'Descriptor facial de 128 valores (face-api.js)',
    ADD COLUMN IF NOT EXISTS webauthn_cred_id VARCHAR(512)  NULL
        COMMENT 'ID de credencial WebAuthn (huella/Windows Hello)',
    ADD COLUMN IF NOT EXISTS webauthn_cred_pk TEXT          NULL
        COMMENT 'Clave pública WebAuthn serializada';

-- Índice para búsqueda rápida por credencial
ALTER TABLE administradores
    ADD INDEX IF NOT EXISTS idx_webauthn_cred (webauthn_cred_id(255));
