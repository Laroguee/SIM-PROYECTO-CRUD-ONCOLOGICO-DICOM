USE ehr_oncologico;

-- 1. Insertar Profesionales de Salud (Ejemplos)
INSERT INTO PROFESIONAL_SALUD (nombres, apellidos, jvpm, especialidad, usuario, password_hash, activo) VALUES
('Carlos', 'Mendoza', 'JVPM-10293', 'Oncología Médica', 'cmendoza', 'hash_dummy_123', 1),
('Ana', 'López', 'JVPM-40592', 'Radiología', 'alopez', 'hash_dummy_123', 1);

-- 2. Insertar Pacientes (Ejemplos con UUID de FHIR estáticos)
INSERT INTO PACIENTE (identificador_fhir, documento_identidad, nombres, apellidos, fecha_nacimiento, genero, activo) VALUES
('b3c8f8b2-a4e9-4e5a-b9c1-7a2e8f1b6a3e', '01234567-8', 'Juan Antonio', 'Pérez', '1965-04-12', 'male', 1),
('c8b9d7a2-f3e4-4d1a-b6c2-8a9e7f1b2c3d', '08765432-1', 'María Elena', 'Gómez', '1970-11-23', 'female', 1),
('d2a1c4b3-e5f6-4a9c-b8d1-9e8f7a2b3c4d', '09876543-2', 'Roberto', 'Sánchez', '1982-02-05', 'male', 1);

-- 3. Insertar Catálogo ICD-O-3 (Ejemplos básicos para pruebas futuras)
INSERT INTO DIAGNOSTICO_ICDO (codigo, descripcion, eje) VALUES
('C50.4', 'Cuadrante superior externo de la mama', 'Topografico'),
('C34.9', 'Pulmón, SAI', 'Topografico'),
('M-8500/3', 'Carcinoma ductal infiltrante, SAI', 'Morfologico'),
('M-8070/3', 'Carcinoma epidermoide, SAI', 'Morfologico');
