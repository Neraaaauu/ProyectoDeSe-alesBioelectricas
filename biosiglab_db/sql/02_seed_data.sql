-- =============================================================
--  BioSigLab — Datos de Prueba (Seed)
--  Ejecutar DESPUÉS de 01_schema.sql
-- =============================================================

USE biosiglab;

-- -------------------------------------------------------------
-- Administrador por defecto
-- Usuario: admin  |  Contraseña: Admin1234!
-- (hash generado con PHP password_hash('Admin1234!', PASSWORD_BCRYPT))
-- -------------------------------------------------------------
INSERT INTO administradores (usuario, clave_hash, nombre_completo, correo)
VALUES (
    'admin',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador BioSigLab',
    'admin@biosiglab.uabc.mx'
);

-- -------------------------------------------------------------
-- Pacientes de prueba
-- -------------------------------------------------------------
INSERT INTO pacientes (nombre, edad, sexo, ciudad, tipo_sangre, notas_clinicas) VALUES
('María González López',    34, 'F', 'Tijuana',   'O+',  'Paciente con historial de arritmia leve'),
('Carlos Ramírez Torres',   52, 'M', 'Mexicali',  'A+',  'Hipertensión arterial controlada'),
('Laura Méndez Castillo',   28, 'F', 'Ensenada',  'B-',  'Sin antecedentes relevantes'),
('Javier Flores Herrera',   45, 'M', 'Tijuana',   'AB+', 'Diabetes tipo 2, monitoreo regular'),
('Ana Patricia Ruiz',       61, 'F', 'Tecate',    'O-',  'Post infarto, seguimiento cardíaco'),
('Roberto Sánchez Díaz',    38, 'M', 'Mexicali',  'A-',  'Atleta, ECG basal de referencia'),
('Sofía Morales Vega',      19, 'F', 'Tijuana',   'B+',  'Estudio preventivo universitario'),
('Miguel Ángel Castro',     70, 'M', 'Ensenada',  'O+',  'Bloqueo de rama derecha detectado'),
('Valentina Torres Luna',   44, 'F', 'Tijuana',   'AB-', 'Control post-quirúrgico'),
('Fernando Ibarra Peña',    55, 'M', 'Rosarito',  'A+',  'Fibrilación auricular paroxística');

-- -------------------------------------------------------------
-- Archivos XML de ECG (datos sintéticos pero estructurados)
-- -------------------------------------------------------------

-- ECG Paciente 1 — María González
INSERT INTO archivos_xml (id_paciente, nombre_archivo, autor, correo_autor, contenido_xml, tamanio_bytes)
VALUES (
    1,
    'ECG_Maria_Gonzalez_2026.xml',
    'Dr. Ernesto Palomares',
    'epalomares@uabc.mx',
    '<?xml version="1.0" encoding="UTF-8"?>
<AnnotatedECG xmlns="urn:hl7-org:v3" classCode="OBS" moodCode="EVN">
  <id root="biosiglab" extension="ECG-001"/>
  <effectiveTime value="20260310120000"/>
  <componentOf>
    <timepointEvent>
      <subject>
        <trialSubject>
          <id extension="PAC-001"/>
          <subjectDemographicPerson>
            <name>María González López</name>
            <administrativeGenderCode code="F"/>
            <birthTime value="19920315"/>
          </subjectDemographicPerson>
        </trialSubject>
      </subject>
    </timepointEvent>
  </componentOf>
  <component>
    <series>
      <code code="II" displayName="Lead II"/>
      <value type="SLIST_PQ">
        <origin value="0" unit="uV"/>
        <scale value="2.5" unit="uV"/>
        <digits>0 0 1 3 6 10 14 18 20 18 14 10 6 3 1 0 0 -2 -4 -3 -1 0 0 0 1 5 25 80 150 200 180 120 60 20 5 1 0 0 0 -5 -10 -15 -12 -8 -4 -1 0 0 0 0 1 3 8 18 30 38 35 28 18 8 2 0 0</digits>
      </value>
    </series>
    <series>
      <code code="V1" displayName="Lead V1"/>
      <value type="SLIST_PQ">
        <origin value="0" unit="uV"/>
        <scale value="2.5" unit="uV"/>
        <digits>0 0 -1 -3 -5 -8 -10 -8 -5 -3 -1 0 0 1 3 8 40 100 140 110 70 30 10 2 0 0 0 -3 -8 -12 -10 -6 -2 0 0 0 1 4 10 20 28 22 14 6 2 0 0</digits>
      </value>
    </series>
  </component>
</AnnotatedECG>',
    1842
);

-- ECG Paciente 2 — Carlos Ramírez
INSERT INTO archivos_xml (id_paciente, nombre_archivo, autor, correo_autor, contenido_xml, tamanio_bytes)
VALUES (
    2,
    'ECG_Carlos_Ramirez_HTA_2026.xml',
    'Dra. Claudia Soto',
    'csoto@uabc.mx',
    '<?xml version="1.0" encoding="UTF-8"?>
<AnnotatedECG xmlns="urn:hl7-org:v3" classCode="OBS" moodCode="EVN">
  <id root="biosiglab" extension="ECG-002"/>
  <effectiveTime value="20260315090000"/>
  <componentOf>
    <timepointEvent>
      <subject>
        <trialSubject>
          <id extension="PAC-002"/>
          <subjectDemographicPerson>
            <name>Carlos Ramírez Torres</name>
            <administrativeGenderCode code="M"/>
            <birthTime value="19740820"/>
          </subjectDemographicPerson>
        </trialSubject>
      </subject>
    </timepointEvent>
  </componentOf>
  <component>
    <series>
      <code code="II" displayName="Lead II"/>
      <value type="SLIST_PQ">
        <origin value="0" unit="uV"/>
        <scale value="2.5" unit="uV"/>
        <digits>0 1 2 5 10 16 22 26 28 26 22 16 10 5 2 1 0 0 -2 -5 -4 -2 0 0 1 6 30 100 180 220 200 140 80 30 8 2 0 0 0 -8 -14 -18 -14 -8 -3 -1 0 0 0 0 2 5 12 25 40 45 38 28 15 5 1 0</digits>
      </value>
    </series>
  </component>
</AnnotatedECG>',
    1210
);

-- ECG Paciente 5 — Ana Patricia (post-infarto)
INSERT INTO archivos_xml (id_paciente, nombre_archivo, autor, correo_autor, contenido_xml, tamanio_bytes)
VALUES (
    5,
    'ECG_AnaPatricia_PostIMIAM_2026.xml',
    'Dr. Ernesto Palomares',
    'epalomares@uabc.mx',
    '<?xml version="1.0" encoding="UTF-8"?>
<AnnotatedECG xmlns="urn:hl7-org:v3" classCode="OBS" moodCode="EVN">
  <id root="biosiglab" extension="ECG-005"/>
  <effectiveTime value="20260320140000"/>
  <componentOf>
    <timepointEvent>
      <subject>
        <trialSubject>
          <id extension="PAC-005"/>
          <subjectDemographicPerson>
            <name>Ana Patricia Ruiz</name>
            <administrativeGenderCode code="F"/>
            <birthTime value="19650502"/>
          </subjectDemographicPerson>
        </trialSubject>
      </subject>
    </timepointEvent>
  </componentOf>
  <component>
    <series>
      <code code="II" displayName="Lead II — Elevacion ST"/>
      <value type="SLIST_PQ">
        <origin value="0" unit="uV"/>
        <scale value="2.5" unit="uV"/>
        <digits>0 0 1 4 8 14 20 24 26 24 20 14 8 4 1 0 0 -1 -3 -2 0 2 5 12 35 110 190 230 210 155 95 40 12 3 0 15 25 30 28 22 16 10 5 2 0 0 0 2 8 20 35 42 38 28 15 5 1 0</digits>
      </value>
    </series>
  </component>
</AnnotatedECG>',
    1380
);

-- -------------------------------------------------------------
-- Encuestas de visitantes
-- -------------------------------------------------------------
INSERT INTO encuestas (nombre, correo, edad, universidad, motivo, aprobado) VALUES
('Daniela Fuentes Lara',    'dfuentes@uabc.edu.mx',   22, 'UABC Tijuana',        'Tesis sobre detección de arritmias con ML',         TRUE),
('José Luis Peñaloza',      'jpenaloza@cetys.mx',      25, 'CETYS Universidad',   'Investigación en procesamiento de señales biomédicas', TRUE),
('Alejandra Vidal Mora',    'avidal@itson.mx',         23, 'ITSON',               'Proyecto de señales para materia de bioingeniería',  FALSE),
('Rodrigo Campos Ibáñez',   'rcampos@uabc.edu.mx',    20, 'UABC Mexicali',       'Acceso a datasets para práctica de laboratorio',    TRUE),
('Fernanda Ríos Domínguez', 'frios@gmail.com',         30, 'Independiente',       'Médico general interesado en telemedicina',          TRUE);
