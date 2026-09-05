# Proyecto: EHR Oncológico - Fase 1 Finalizada

Este proyecto contiene el backend (Node.js/MySQL) y frontend (React/Vite) para un sistema de Registro de Salud Electrónico (EHR) especializado en Oncología.

## Requisitos previos

- **Node.js** instalado (v16 o superior recomendado).
- **XAMPP** instalado (para correr el servidor local de MySQL y Apache).

---

## 1. Configuración de la Base de Datos (Importante para el equipo)

Para que el proyecto funcione en sus computadoras locales, deben reconstruir la base de datos siguiendo estos pasos exactos:

1. **Encender XAMPP:**
   - Abre el Panel de Control de XAMPP.
   - Haz clic en **Start** en los módulos de **Apache** y **MySQL**.

2. **Importar la Estructura (`schema.sql`):**
   - Abre tu navegador y ve a `http://localhost/phpmyadmin`.
   - Asegúrate de **NO** tener seleccionada ninguna base de datos en la barra lateral izquierda.
   - Ve a la pestaña **Importar** (menú superior).
   - Haz clic en **Seleccionar archivo** y busca el archivo `/database/schema.sql` que se encuentra en la carpeta de este proyecto.
   - Haz clic en **Continuar** (Go) abajo del todo. Esto creará la base de datos vacía `ehr_oncologico` con todas las 9 tablas requeridas.

3. **Importar los Datos de Prueba (`seed.sql`):**
   - **¡No te saltes este paso!**
   - Estando aún en phpMyAdmin, repite el proceso: ve a **Importar**.
   - Selecciona el archivo `/database/seed.sql` de este proyecto.
   - Haz clic en **Continuar**. Esto poblará el catálogo de CIE-O-3 (ICD-O), insertará médicos de prueba (Dr. Mendoza) y algunos pacientes base para que el sistema no esté vacío al iniciar.

---

## 2. Instalación y Ejecución

Debes abrir **dos terminales separadas**, una para el Backend y otra para el Frontend.

### Terminal 1: Backend (Node.js)

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Verifica que tu archivo `backend/.env` exista y tenga las credenciales correctas. (Las por defecto para XAMPP ya están listas):
   ```env
   PORT=3001
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=ehr_oncologico
   ```
4. Arranca el servidor (y déjalo abierto):
   ```bash
   node server.js
   ```
   *Deberías ver un mensaje en verde diciendo que se conectó a la base de datos.*

### Terminal 2: Frontend (React)

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre la ruta que te indica la terminal (por defecto `http://localhost:5173`) en tu navegador.

---

## 3. Guía de Pruebas (Validación del Avance)

Para los demás integrantes del equipo, aquí está la ruta de pruebas que deben realizar para confirmar que la **Fase 1 (Flujo Administrativo y Clínico)** funciona perfectamente:

### Prueba A: Gestión de Pacientes (CRUD)
1. En el menú lateral, ve a **Pacientes**.
2. Dale clic a **+ Nuevo Paciente**.
3. Llena el formulario. Verás que este está adaptado para estandarizarse con **HL7 FHIR** por debajo (generando el JSON).
4. Dale clic en guardar y verifica que aparezca en la tabla.
5. Intenta Editar o Eliminar a un paciente.

### Prueba B: Agendamiento de Citas (Agenda)
1. Ve al menú **Agenda** en la barra lateral.
2. Da clic en **Agendar Cita**.
3. Verás que los "Selects" de Pacientes y Médicos ya traen la información que importaste con el `seed.sql`.
4. Agenda una cita y guárdala.
5. Regresa a la tabla de agenda y verifica que la cita aparezca con su "Badge" azul de *Programada*. Puedes intentar cancelarla con el botón rojo de la derecha.

### Prueba C: Expediente Médico Especializado (Core)
1. Regresa al menú de **Pacientes**.
2. En la tabla de pacientes, en la fila de tu paciente creado (o Juan Antonio Pérez), haz clic en el **botón verde con forma de Ojo** (Ver Expediente).
3. **Pestaña Diagnósticos:** Añade un diagnóstico. Nota cómo el selector te extrae el catálogo internacional **CIE-O-3** desde la base de datos.
4. **Pestaña Tumor y Estadiaje:** Selecciona el diagnóstico que acabas de crear en el selector superior y guarda los detalles del tumor (ej. Localización, grado tumoral) y el Estadiaje TNM.
5. **Pestaña Quimioterapia:** Agenda un ciclo de medicación. Luego presiona el botón "Marcar Completado" en la tarjeta.

¡Con esto el flujo del EHR queda 100% demostrado!
