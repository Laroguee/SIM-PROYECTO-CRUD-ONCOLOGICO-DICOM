require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Inicializa y prueba la conexión a BD

const app = express();
const port = process.env.PORT || 3001;

const patientsRoutes = require('./routes/patients');
const profesionalesRoutes = require('./routes/profesionales');
const citasRoutes = require('./routes/citas');
const icdoRoutes = require('./routes/icdo');
const diagnosticosRoutes = require('./routes/diagnosticos');
const tumoresRoutes = require('./routes/tumores');
const estadiajesRoutes = require('./routes/estadiajes');
const quimioterapiasRoutes = require('./routes/quimioterapias');

app.use(cors());
app.use(express.json());

// Montar rutas RESTful
app.use('/api/patients', patientsRoutes);
app.use('/api/profesionales', profesionalesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/icdo', icdoRoutes);
app.use('/api/diagnosticos', diagnosticosRoutes);
app.use('/api/tumores', tumoresRoutes);
app.use('/api/estadiajes', estadiajesRoutes);
app.use('/api/quimioterapias', quimioterapiasRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
