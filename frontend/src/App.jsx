import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PatientList from './pages/Patients/PatientList';
import PatientForm from './pages/Patients/PatientForm';
import PatientDetail from './pages/Patients/PatientDetail';
import AgendaList from './pages/Agenda/AgendaList';
import AgendaForm from './pages/Agenda/AgendaForm';

// Componentes temporales para el Dashboard
const Dashboard = () => (
  <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-white rounded-xl shadow-sm border p-8">
    <div className="text-center">
      <h2 className="text-4xl font-bold text-emerald-800 mb-4">EHR Oncológico</h2>
      <p className="text-lg text-emerald-600 mb-8 max-w-md mx-auto">Sistema integral para la gestión de expedientes clínicos oncológicos y trazabilidad FHIR.</p>
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border text-left">
          <div className="text-3xl font-bold text-slate-800">FHIR</div>
          <div className="text-slate-500 text-sm">Interoperabilidad</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border text-left">
          <div className="text-3xl font-bold text-slate-800">ICD-O-3</div>
          <div className="text-slate-500 text-sm">Estándar Oncológico</div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pacientes" element={<PatientList />} />
          <Route path="pacientes/nuevo" element={<PatientForm />} />
          <Route path="pacientes/editar/:id" element={<PatientForm />} />
          <Route path="pacientes/:id" element={<PatientDetail />} />
          
          <Route path="agenda" element={<AgendaList />} />
          <Route path="agenda/nueva" element={<AgendaForm />} />
          <Route path="agenda/editar/:id" element={<AgendaForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
